import { ImagePlaceholder } from "../../_shared/ImagePlaceholder";

const items = [
  { id: "real-result-cityscape", label: "Futuristic Cityscape" },
  { id: "gallery-landscape",     label: "Cinematic Landscape" },
  { id: "gallery-scifi",         label: "Sci-Fi Concept" },
  { id: "gallery-anime",         label: "Anime Style" },
  { id: "gallery-product",       label: "Product Photography" },
  { id: "gallery-oil-painting",  label: "Oil Painting" },
  { id: "gallery-abstract",      label: "Abstract Digital Art" },
  { id: "gallery-food",          label: "Food Photography" },
] as const;

export function SeeInAction() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ color: "var(--accent)" }}>
          Gallery
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          See ChatGPT Image 2.0 in Action
        </h2>
        <p className="text-center text-lg mb-12 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          Every image below was generated directly by ChatGPT Image 2.0 from a single text
          prompt — no retouching, no post-processing, no external tools. These are the raw outputs.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map(({ id, label }) => (
            <div key={id}>
              <ImagePlaceholder
                resourceId={id}
                alt={label}
                aspectRatio="4/3"
                className="w-full"
              />
            </div>
          ))}
        </div>

        <p className="text-center text-sm mt-8" style={{ color: "var(--muted2)" }}>
          Gallery shows a sample of the styles ChatGPT Image 2.0 handles natively —
          photorealism, anime, oil painting, product photography, concept art, and more.
        </p>
      </div>
    </section>
  );
}
