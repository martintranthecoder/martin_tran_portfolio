"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils"; 
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";

interface SwipeCardsProps {
  className?: string;
}

const SwipeCards = ({ className }: SwipeCardsProps) => {
  const [cards, setCards] = useState<Card[]>(cardData);

  const resetCards = () => {
    setCards(cardData);
  };

  return (
    <div
      className={cn(
        "relative grid h-[233px] w-[175px] place-items-center",
        className,
      )}
    >
      {cards.length === 0 && (
        <div style={{ gridRow: 1, gridColumn: 1 }} className="z-20">
          <Button onClick={resetCards} variant={"outline"}>
            <RefreshCw className="size-4" />
            Again
          </Button>
        </div>
      )}
      {cards.map((card) => {
        return (
          <Card key={card.id} cards={cards} setCards={setCards} {...card} />
        );
      })}
    </div>
  );
};

const Card = ({
  id,
  url,
  date,
  title,
  description,
  setCards,
  cards,
}: {
  id: number;
  url: string;
  date: string;
  title: string;
  description: string;
  setCards: Dispatch<SetStateAction<Card[]>>;
  cards: Card[];
}) => {
  const x = useMotionValue(0);

  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1]?.id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;
    return `${rotateRaw.get() + offset}deg`;
  });

  const [flipped, setFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (event: any, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > 100) {
      // If swiped far enough, remove the card
      setCards((pv) => pv.filter((v) => v.id !== id));
    } else {
      // Otherwise, animate the card back to the center
      animate(x, 0, {
        type: "spring",
        stiffness: 400,
        damping: 40,
      });
    }
  };

  return (
    <motion.div
      className="absolute h-[233px] w-[175px] origin-bottom rounded-lg overflow-hidden hover:cursor-grab active:cursor-grabbing"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        perspective: 1000,
        boxShadow: isFront
          ? "0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)"
          : undefined,
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: -150,
        right: 150,
        top: 0,
        bottom: 0,
      }}
      onDragStart={() => {
        setIsDragging(true);
        setFlipped(false);
      }}
      onDragEnd={(event, info) => {
        handleDragEnd(event, info);
        setIsDragging(false);
      }}
      onMouseEnter={() => {
        if (isFront && !isDragging) setFlipped(true);
      }}
      onMouseLeave={() => setFlipped(false)}
      onTap={() => {
        if (!isFront) return;
        if (Math.abs(x.get()) > 6) return;
        setFlipped((f) => !f);
      }}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped && !isDragging ? 180 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <Image
            src={url}
            alt={title}
            fill
            sizes="175px"
            className="object-cover pointer-events-none"
            quality={95}
            priority
            draggable={false}
          />
        </div>

        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-center items-center text-center gap-2 p-4 bg-card text-card-foreground border border-border rounded-lg">
          <p className="text-xs text-muted-foreground leading-snug">{date}</p>
          <h3 className="text-sm font-semibold leading-tight">{title}</h3>
          <p className="text-xs text-muted-foreground leading-snug">
            {description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SwipeCards;

type Card = {
  id: number;
  url: string;
  date: string;
  title: string;
  description: string;
};

const cardData: Card[] = [
  {
    id: 1,
    url: "/img/real-jellyfish.jpg",
    date: "July, 2025",
    title: "Seattle Aquarium",
    description: "litterally so pretty of a jellyfish",
  },
  {
    id: 2,
    url: "/img/martin-2024.jpg",
    date: "June, 2024",
    title: "Montara, CA",
    description: "lil hikey",
  },
  {
    id: 3,
    url: "/img/martin-2025.jpg",
    date: "July, 2025",
    title: "Bainbridge Island, WA",
    description: "goofy around",
  },
  {
    id: 4,
    url: "/img/martin.jpg",
    date: "March, 2023",
    title: "San Jose State University",
    description: "so professional",
  },
];
