import { ArrowUpRight, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { galleryCategories, galleryItems } from '@/lib/gallery-data';

export default function GalleryPreview() {
  return (
    <section className="gallery-preview section-space container" id="categories" aria-labelledby="categories-heading">
      <div className="section-heading">
        <h2 id="categories-heading">The right seating for your space.</h2>
        <p>Explore dining sets for two, four or six, and restaurant sofas. Browse the photos and share your favourites with us.</p>
      </div>
      <div className="category-preview-grid">
        {galleryCategories.map(category => {
          const cover = galleryItems.find(item => item.id === category.coverId)!;
          const count = galleryItems.filter(item => item.category === category.id).length;
          return (
            <a className="category-preview-card" href={`/gallery/?category=${category.id}`} key={category.id}>
              <div className="category-preview-image">
                <img src={cover.image.replace('.webp', '-480.webp')} alt={cover.alt} width={cover.width} height={cover.height} loading="lazy" />
              </div>
              <span className="category-preview-count">{count} photos</span>
              <div className="category-preview-title"><h3>{category.label}</h3><ArrowUpRight size={21} aria-hidden="true" /></div>
            </a>
          );
        })}
      </div>
      <a className="button button-outline gallery-preview-all" href="/gallery/">Explore the full gallery <ArrowRight size={18} aria-hidden="true" /></a>
    </section>
  );
}
