import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import careerData from "@/data/career.json";
import educationData from "@/data/education.json";
import { careerSchema, educationSchema } from "@/lib/schemas";
import Timeline from "./Timeline";

export default function Experience() {
  const career = careerSchema.parse(careerData).career;
  const education = educationSchema.parse(educationData).education;

  return (
    <Tabs defaultValue="work">
      <TabsList className="mb-2 grid w-full grid-cols-2 bg-muted/50 backdrop-blur-md dark:bg-muted/40">
        <TabsTrigger
          value="work"
          className="data-[state=active]:bg-background/60 data-[state=active]:backdrop-blur-md dark:data-[state=active]:bg-background/50"
        >
          Work
        </TabsTrigger>
        <TabsTrigger
          value="education"
          className="data-[state=active]:bg-background/60 data-[state=active]:backdrop-blur-md dark:data-[state=active]:bg-background/50"
        >
          Education
        </TabsTrigger>
      </TabsList>
      <TabsContent value="work">
        <Timeline experience={career}></Timeline>
      </TabsContent>
      <TabsContent value="education">
        <Timeline experience={education}></Timeline>
      </TabsContent>
    </Tabs>
  );
}
