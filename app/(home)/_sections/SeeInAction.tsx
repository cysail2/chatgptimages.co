import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const items = [
  { id: "gallery-portrait",     label: "Realistic Portrait",   span: "row-span-2" },
  { id: "gallery-landscape",    label: "Cinematic Landscape",  span: "" },
  { id: "gallery-scifi",        label: "Sci-Fi Concept",       span: "" },
  { id: "gallery-anime",        label: "Anime Style",          span: "" },
  { id: "gallery-product",      label: "Product Photography",  span: "" },
  { id: "gallery-oil-painting", label: "Oil Painting",         span: "" },
  { id: "gallery-abstract",     label: "Abstract Digital Art", span: "" },
  { id: "gallery-food",         label: "Food Photography",     span: "" },
];

export function SeeInAction() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ color: "var(--accent)" }}>
          Gallery
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          See ChatGPT Images 2.0 in Action
        </h2>
        <p className="text-center text-lg mb-12 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          Every image below was generated directly by ChatGPT Images 2.0 from a single text
          prompt — no retouching, no post-processing, no external tools. These are the raw outputs.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px]">
          {items.map(({ id, label, span }) => (
            <div key={id} className={span}>
              <ImagePlaceholder
                resourceId={id}
                alt={label}
                aspectRatio="free"
                className="h-full w-full"
              />
            </div>
          ))}
        </div>

        <p className="text-center text-sm mt-8" style={{ color: "var(--muted2)" }}>
          Gallery shows a sample of the styles ChatGPT Images 2.0 handles natively —
          photorealism, anime, oil painting, product photography, concept art, and more.
        </p>
      </div>
    </section>
  );
}
