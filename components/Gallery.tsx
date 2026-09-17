'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, ArrowsOutSimple, WhatsappLogo, X } from '@phosphor-icons/react';
import { business, whatsapp } from '@/lib/business';
import { galleryCategories, galleryItems, type GalleryCategoryId } from '@/lib/gallery-data';

type CategoryFilter = GalleryCategoryId | 'all';
type GalleryItem = (typeof galleryItems)[number];

function readCategory(): CategoryFilter {
  const value = new URLSearchParams(window.location.search).get('category');
  return galleryCategories.some((category) => category.id === value) ? value as GalleryCategoryId : 'all';
}

function imageSet(item: GalleryItem) {
  // The original can be smaller than a derivative's target width, so describe
  // each file with its actual width and leave duplicate sizes out of srcSet.
  return [
    ...(item.width > 480 ? [`${item.image.replace('.webp', '-480.webp')} 480w`] : []),
    ...(item.width > 800 ? [`${item.image.replace('.webp', '-800.webp')} 800w`] : []),
    `${item.image} ${item.width}w`,
  ].join(', ');
}

export default function Gallery() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selected = galleryItems.find((item) => item.id === selectedId);
  const selectedCategory = galleryCategories.find((item) => item.id === selected?.category);
  const selectedGroup = galleryItems.filter((item) => item.category === selected?.category);
  const selectedIndex = selectedGroup.findIndex((item) => item.id === selectedId);
  const visibleGroups = galleryCategories.filter((item) => category === 'all' || item.id === category);
  const matchingCount = galleryItems.filter((item) => category === 'all' || item.category === category).length;
  const isOpen = Boolean(selected);

  useEffect(() => {
    const syncCategory = () => setCategory(readCategory());
    syncCategory();
    window.addEventListener('popstate', syncCategory);
    return () => window.removeEventListener('popstate', syncCategory);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  function chooseCategory(nextCategory: CategoryFilter) {
    setCategory(nextCategory);
    const url = new URL(window.location.href);
    if (nextCategory === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', nextCategory);
    url.hash = '';
    window.history.replaceState(window.history.state, '', url);
  }

  function openPhoto(item: GalleryItem, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setSelectedId(item.id);
  }

  function closePhoto() {
    setSelectedId(null);
    dialogRef.current?.close();
  }

  function stepPhoto(direction: -1 | 1) {
    if (selectedGroup.length < 2) return;
    setSelectedId(selectedGroup[(selectedIndex + direction + selectedGroup.length) % selectedGroup.length].id);
  }

  function enquiryLink(item: GalleryItem) {
    const categoryLabel = galleryCategories.find((group) => group.id === item.category)?.label;
    return whatsapp(`Hello, I am interested in ${item.title} from your ${categoryLabel} gallery. Design reference: ${item.id.toUpperCase()}. Please share the available options, dimensions and availability.`);
  }

  return <>
    <div className="gallery-toolbar" id="gallery-categories">
      <div className="gallery-filters" role="group" aria-label="Filter gallery by seating category">
        <button type="button" className="gallery-filter" aria-pressed={category === 'all'} aria-controls="gallery-results" onClick={() => chooseCategory('all')}>All furniture <span>{galleryItems.length}</span></button>
        {galleryCategories.map((group) => <button key={group.id} type="button" className="gallery-filter" aria-pressed={category === group.id} aria-controls="gallery-results" onClick={() => chooseCategory(group.id)}>{group.label}<span>{galleryItems.filter((item) => item.category === group.id).length}</span></button>)}
      </div>
      <div className="gallery-results-note">
        <p role="status" aria-live="polite" aria-atomic="true">{matchingCount} furniture photos{category !== 'all' ? ` · ${visibleGroups[0]?.label}` : ' · 4 categories'}</p>
        <p>Open a photo for a closer look.</p>
      </div>
    </div>

    <div id="gallery-results">
      {visibleGroups.map((group, groupIndex) => {
        const items = galleryItems.filter((item) => item.category === group.id);
        return <section className="gallery-group" key={group.id} aria-labelledby={`gallery-heading-${group.id}`}>
          <div className="gallery-group-heading">
            <div><h2 id={`gallery-heading-${group.id}`}>{group.label}</h2><p className="gallery-group-description">{group.description}</p></div>
            <span className="gallery-group-count">{items.length} photos</span>
          </div>
          <div className="gallery-photo-grid">
            {items.map((item, itemIndex) => <article className="gallery-photo-card" key={item.id} id={item.id}>
              <button type="button" className="gallery-photo-button" aria-label={`View ${item.title}, reference ${item.id}`} aria-haspopup="dialog" onClick={(event) => openPhoto(item, event.currentTarget)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image.replace('.webp', '-800.webp')} srcSet={imageSet(item)} sizes="(max-width: 479px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 70px) / 2), (max-width: 1399px) calc((100vw - 160px) / 3), 410px" alt={item.alt} width={item.width} height={item.height} loading={groupIndex === 0 && itemIndex < 3 ? 'eager' : 'lazy'} decoding="async" />
                <span className="gallery-enlarge" aria-hidden="true"><ArrowsOutSimple size={20} /></span>
              </button>
              <div className="gallery-photo-caption">
                <div><p className="gallery-reference">{item.id.toUpperCase()}</p><h3>{item.title}</h3></div>
                <button type="button" className="gallery-photo-open" aria-label={`View details for ${item.title}, reference ${item.id}`} aria-haspopup="dialog" onClick={(event) => openPhoto(item, event.currentTarget)}><ArrowUpRight size={22} aria-hidden="true" /></button>
              </div>
            </article>)}
          </div>
          <a className="gallery-back-link" href="#gallery-categories">Back to categories <ArrowUp size={17} aria-hidden="true" /></a>
        </section>;
      })}
    </div>

    <dialog className="gallery-dialog" ref={dialogRef} aria-labelledby="gallery-dialog-title" aria-describedby="gallery-dialog-description" onClose={() => {
      setSelectedId(null);
      triggerRef.current?.focus({ preventScroll: true });
    }} onClick={(event) => {
      if (event.target === event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closePhoto();
      }
    }} onKeyDown={(event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); stepPhoto(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); stepPhoto(1); }
    }}>
      {selected && <div className="gallery-dialog-layout">
        <button className="gallery-dialog-close icon-button" type="button" aria-label="Close furniture photo" onClick={closePhoto} autoFocus><X size={23} aria-hidden="true" /></button>
        <div className="gallery-dialog-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selected.image} alt={selected.alt} width={selected.width} height={selected.height} />
        </div>
        <div className="gallery-dialog-content">
          <p className="eyebrow">{selectedCategory?.label}</p>
          <h2 id="gallery-dialog-title">{selected.title}</h2>
          <p className="gallery-dialog-reference">Design reference <strong>{selected.id.toUpperCase()}</strong></p>
          <p id="gallery-dialog-description">Like this setting? Send us this design reference to discuss colours, dimensions, quantities and current availability for your space.</p>
          <a className="button button-primary gallery-enquire-button" href={enquiryLink(selected)} target="_blank" rel="noopener noreferrer"><WhatsappLogo size={23} aria-hidden="true" /><span>Enquire on WhatsApp<strong>{business.phone}</strong></span><ArrowUpRight size={19} aria-hidden="true" /></a>
          <div className="gallery-dialog-nav" aria-label="Browse photos in this category">
            <button className="icon-button" type="button" aria-label="Previous furniture photo" onClick={() => stepPhoto(-1)}><ArrowLeft size={21} aria-hidden="true" /></button>
            <p aria-live="polite" aria-atomic="true">{selectedIndex + 1} / {selectedGroup.length}<span>{selectedCategory?.label}</span></p>
            <button className="icon-button" type="button" aria-label="Next furniture photo" onClick={() => stepPhoto(1)}><ArrowRight size={21} aria-hidden="true" /></button>
          </div>
        </div>
      </div>}
    </dialog>
  </>;
}
