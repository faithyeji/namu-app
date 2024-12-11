import Link from "next/link";

const Plant = ({ project }) => {
  const plantImages = {
    1: "/icons/poppy.svg",
    2: "/icons/lavender.svg",
  };
  const plantImage = plantImages[project.plantTypeId];

  return (
    <div
      className="relative"
      style={{
        left: `${project.positionX}px`,
        top: `${project.positionY}px`,
        width: "60px",
        height: "fit",
      }}
    >
      <Link href={`/pages/projects/${project.id}`}>
        <img
          src={plantImage}
          alt={project.name}
          className="w-full h-full cursor-pointer"
        />
      </Link>
    </div>
  );
};

export default Plant;
