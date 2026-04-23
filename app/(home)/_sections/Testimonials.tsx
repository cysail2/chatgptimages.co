import { Star } from "lucide-react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

const reviews = [
  {
    avatarId: "avatar-sarah",
    name: "Sarah M.",
    role: "Marketing Manager",
    rating: 5,
    text: "This generator replaced our stock photo subscription entirely. We produce campaign visuals in minutes, not days. The quality is genuinely impressive.",
  },
  {
    avatarId: "avatar-james",
    name: "James K.",
    role: "UX Designer",
    rating: 5,
    text: "I use it for rapid concept exploration. Being able to go from a text idea to a visual reference in seconds has completely changed how I present to clients.",
  },
  {
    avatarId: "avatar-priya",
    name: "Priya S.",
    role: "Content Creator",
    rating: 5,
    text: "The image-to-image feature is a game changer. I upload my rough sketch and get a polished version instantly. My YouTube thumbnails look professional now.",
  },
  {
    avatarId: "avatar-marco",
    name: "Marco L.",
    role: "Graphic Designer",
    rating: 5,
    text: "4K resolution output is something I didn't expect at this price point. The credit pack model is perfect — I pay for exactly what I use.",
  },
  {
    avatarId: "avatar-emily",
    name: "Emily R.",
    role: "E-commerce Owner",
    rating: 5,
    text: "Product photography used to cost me hundreds per shoot. Now I generate studio-quality product images from a prompt for a few cents each.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 px-6" style={{ background: "var(--bg2)" }}>
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ color: "var(--accent)" }}>
          Reviews
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
          What Users Are Saying About ChatGPT Images 2.0
        </h2>
        <p className="text-center text-lg mb-14 max-w-2xl mx-auto" style={{ color: "var(--muted)" }}>
          Thousands of marketers, designers, and content creators rely on the generator every day.
          Here&apos;s what they have to say about switching from their previous workflow.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {reviews.map(({ avatarId, name, role, rating, text }) => (
            <div key={name} className="p-6 rounded-2xl flex flex-col gap-4"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <Stars count={rating} />
              <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--muted)" }}>
                &ldquo;{text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                <ImagePlaceholder
                  resourceId={avatarId}
                  alt={name}
                  aspectRatio="1/1"
                  className="w-10 h-10 rounded-full shrink-0"
                />
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs" style={{ color: "var(--muted2)" }}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
