#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import { ContentChunk, ExtractedContent } from "./content-types";

/**
 * Convert string to kebab-case
 */
function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

/**
 * Extract homepage content from structured JSON
 */
function extractHomepageContent(): ContentChunk[] {
  const filePath = path.join(process.cwd(), "src/data/home.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // Group all homepage content into a single coherent chunk
  const homepageContent = `${data.introduction.greeting} ${data.introduction.description}. ${data.introduction.chatPrompt}. ${data.introduction.escalation.text} ${data.introduction.escalation.linkText} (${data.escalationLink.href}) ${data.introduction.escalation.suffix}`;

  return [
    {
      slug: "/",
      title: "Homepage - Hero welcome section",
      content: homepageContent,
      metadata: {
        contentType: "page",
        enrichment: [
          "This is my portfolio homepage with introduction and welcome message",
          "I'm a backend developer with full-stack experience",
          "You can chat with Ted Support for questions and answers",
          "For escalations, contact Ted Lead on Instagram (this is a joke reference to my cat)",
          "This site showcases my projects, career, and education",
        ],
      },
    },
  ];
}


/**
 * Extract structured data from projects JSON
 */
function extractProjectsData(): ContentChunk[] {
  const filePath = path.join(process.cwd(), "src/data/projects.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const chunks: ContentChunk[] = [];

  data.projects.forEach((project: any) => {
    // Create a coherent project description with links included
    const projectText = `Project name: ${project.name}. ${project.description}. Technologies: ${project.tags.join(", ")}.`;

    const linksText =
      project.links && project.links.length > 0
        ? ` Links: ${project.links.map((link: any) => `${link.name}: ${link.href}`).join(" | ")}`
        : "";

    chunks.push({
      slug: `projects:${toKebabCase(project.name)}`,
      title: `Project: ${project.name}`,
      content: projectText + linksText,
      metadata: {
        contentType: "project",
        enrichment: [
          `I built ${project.name} using ${project.tags.join(", ")}`,
          `This project uses technologies like ${project.tags.join(", ")}`,
          `${project.name} is a ${project.name.includes("(Final Year)") || project.name.includes("(2nd Year)") ? "school" : "personal"} project`,
          `I developed ${project.name} as a ${project.tags.length > 5 ? "complex" : "moderate"} project`,
          `The ${project.name} project focuses on ${project.tags.includes("Web3") || project.tags.includes("NFT") ? "blockchain technology" : project.tags.includes("Game") ? "game development" : "web development"}`,
          `My technical skills include ${project.tags.join(", ")} from building ${project.name}`,
          `I created ${project.name} which demonstrates my ${project.tags.join(", ")} expertise`,
        ],
      },
    });
  });

  return chunks;
}

/**
 * Extract structured data from career JSON
 */
function extractCareerData(): ContentChunk[] {
  const filePath = path.join(process.cwd(), "src/data/career.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const chunks: ContentChunk[] = [];

  data.career.forEach((company: any) => {
    // Iterate over each position within the company
    company.positions.forEach((position: any) => {
      const description = position.description ? position.description.join(" ") : "";
      const jobText = `Company: ${company.name} - ${position.title}. Period: ${position.start}${position.end ? ` to ${position.end}` : " (Current)"}. ${description}`;

      const linksText =
        position.links && position.links.length > 0
          ? ` Related Projects: ${position.links.map((link: any) => `${link.name}: ${link.href}`).join(" | ")}`
          : "";

      chunks.push({
        slug: `career:${toKebabCase(company.name)}-${toKebabCase(position.title)}`,
        title: `Career: ${company.name} - ${position.title}`,
        content: jobText + linksText,
        metadata: {
          contentType: "career",
          enrichment: [
            `I worked at ${company.name} as a ${position.title}`,
            `My role at ${company.name} was ${position.title}`,
            `I was employed at ${company.name} from ${position.start}${position.end ? ` to ${position.end}` : " to present"}`,
            `During my time at ${company.name}, I worked as a ${position.title}`,
            `My employment history includes working at ${company.name}`,
            `I gained experience at ${company.name} in the ${company.name.includes("Bank") ? "finance" : company.name.includes("Institute") ? "education" : "technology"} industry`,
            `This was a ${position.title.includes("Intern") ? "internship position" : position.title.includes("Graduate") ? "entry-level graduate role" : "professional position"}`,
          ],
        },
      });
    });
  });

  return chunks;
}

/**
 * Extract structured data from education JSON
 */
function extractEducationData(): ContentChunk[] {
  const filePath = path.join(process.cwd(), "src/data/education.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const chunks: ContentChunk[] = [];

  data.education.forEach((school: any) => {
    // Iterate over each position (degree) within the school
    school.positions.forEach((position: any) => {
      const description = position.description ? position.description.join(" ") : "";
      const eduText = `School: ${school.name}. Degree: ${position.title}. Period: ${position.start} to ${position.end}. ${description}`;

      const linksText =
        position.links && position.links.length > 0
          ? ` Projects: ${position.links.map((link: any) => `${link.name}: ${link.href}`).join(" | ")}`
          : "";

      chunks.push({
        slug: `education:${toKebabCase(school.name)}-${toKebabCase(position.title)}`,
        title: `Education: ${school.name} - ${position.title}`,
        content: eduText + linksText,
        metadata: {
          contentType: "education",
          enrichment: [
            `I studied at ${school.name} and earned a ${position.title}`,
            `My education includes ${position.title} from ${school.name}`,
            `I attended ${school.name} from ${position.start} to ${position.end}`,
            `I completed my ${position.title.includes("Bachelor") ? "bachelor's degree" : "associate degree"} at ${school.name}`,
            `My field of study was ${position.title.includes("Computer") ? "computer science/engineering" : "technology"}`,
            `I graduated from ${school.name} with a degree in ${position.title}`,
            `My academic background includes ${position.title} from ${school.name}`,
          ],
        },
      });
    });
  });

  return chunks;
}

/**
 * Extract structured data from socials JSON
 */
function extractSocialsData(): ContentChunk[] {
  const filePath = path.join(process.cwd(), "src/data/socials.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // Create a single coherent chunk for all social links with descriptions
  const socialsContent = data.socials
    .map((social: any) => {
      let description = "";
      switch (social.name) {
        case "LinkedIn":
          description = " - Connect professionally and view my resume";
          break;
        case "GitHub":
          description = " - Explore my code repositories and projects";
          break;
        case "Email":
          description = " - Preferred communication, send me a direct email";
          break;
      }
      return `${social.name}: ${social.href}${description}`;
    })
    .join(" | ");

  return [
    {
      slug: "socials:links",
      title: "Social Media Links",
      content: socialsContent,
      metadata: {
        contentType: "social",
        enrichment: [
          "You can connect with me professionally on LinkedIn",
          "My GitHub contains all my code repositories and projects",
          "You can email me directly for communication",
          "These are my social media profiles and contact links",
          "I'm available on LinkedIn for professional networking",
          "My GitHub showcases my programming projects and skills",
          "Email is my preferred method for direct communication",
        ],
      },
    },
  ];
}

/**
 * Extract site navigation structure and available routes dynamically
 */
function extractNavigationContent(): ContentChunk[] {
  const routesFilePath = path.join(process.cwd(), "src/data/routes.json");
  const routesData = JSON.parse(fs.readFileSync(routesFilePath, "utf-8"));

  // Create navigation content from all routes
  const navigationContent = routesData.routes
    .map(
      (route: any) => `'${route.path}' - ${route.name}: ${route.description}`,
    )
    .join(" | ");

  // Add external links
  const externalLinksContent = routesData.externalLinks
    .map((link: any) => `'${link.path}' - ${link.name}: ${link.description}`)
    .join(" | ");

  return [
    {
      slug: "navigation:routes",
      title: "Site Navigation",
      content: `Available Routes: ${navigationContent} | External Links: ${externalLinksContent}`,
      metadata: {
        contentType: "navigation",
        enrichment: [
          "This website has navigation to different sections like projects and contact",
          "You can navigate to my projects page to see my work",
          "There's a contact page for getting in touch with me",
          "The site structure includes homepage, projects, and contact sections",
          "You can find my resume through the navigation",
        ],
      },
    },
  ];
}

/**
 * Main function to extract all content
 */
function extractAllContent(): ExtractedContent {
  const contentChunks: ContentChunk[] = [
    ...extractHomepageContent(),
    ...extractProjectsData(),
    ...extractCareerData(),
    ...extractEducationData(),
    ...extractSocialsData(),
    ...extractNavigationContent(),
  ];

  return {
    timestamp: new Date().toISOString(),
    content: contentChunks,
  };
}

/**
 * Main execution
 */
function main() {
  try {
    console.log("Starting content extraction...");

    const extractedContent = extractAllContent();

    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write extracted content to JSON file
    const outputPath = path.join(outputDir, "extracted-content.json");
    fs.writeFileSync(
      outputPath,
      JSON.stringify(extractedContent, null, 2),
      "utf-8",
    );

    console.log(`Content extraction completed successfully!`);
    console.log(`Output saved to: ${outputPath}`);
    console.log(
      `Total content chunks extracted: ${extractedContent.content.length}`,
    );

    // Output extracted content summary for build logs
    console.log("\n--- Extracted Content Summary ---");
    extractedContent.content.forEach((chunk, index) => {
      console.log(`[${index + 1}] ${chunk.slug}: ${chunk.title}`);
      console.log(
        `     Content preview: ${chunk.content.substring(0, 100)}...`,
      );
    });
    console.log("--- End of Content Summary ---\n");
  } catch (error) {
    console.error("Error during content extraction:", error);
    process.exit(1);
  }
}

// Run the script if called directly
main();
