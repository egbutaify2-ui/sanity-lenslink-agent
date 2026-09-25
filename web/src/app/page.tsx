import { client } from "@/sanity/client";
import { CAMERAS_QUERY } from "@/sanity/queries";

export default async function Home() {
  const cameras = await client.fetch(CAMERAS_QUERY);

  return (
    <main className="page">
      <section className="hero">
        <span className="eyebrow">SANITY CHALLENGE 2026</span>
        <h1>LensLink</h1>
        <p>
          An AI camera-gear compatibility agent built on structured Sanity
          content.
        </p>
      </section>

      <section className="card">
        <div>
          <span className="label">SANITY CONTENT</span>
          <h2>Camera knowledge base</h2>
          <p>
            This frontend is connected to Sanity project <strong>kv3pdv23</strong>.
          </p>
        </div>

        {cameras.length === 0 ? (
          <div className="empty">
            No cameras have been entered yet. We’ll populate the knowledge base
            next.
          </div>
        ) : (
          <div className="grid">
            {cameras.map((camera) => (
              <article className="camera" key={camera._id}>
                <span>{camera.brand}</span>
                <h3>{camera.name}</h3>
                <p>{camera.mount ?? "Mount not set"}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
