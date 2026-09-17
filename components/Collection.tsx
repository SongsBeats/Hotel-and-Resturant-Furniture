'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, WhatsappLogo, X } from '@phosphor-icons/react';
import {
  furniture,
  furnitureCategories,
  furnitureEnquiry,
  furnitureImage,
  furnitureImageSet,
  type FurnitureCategory,
} from '../lib/collection';

export default function Collection() {
  const [category, setCategory] = useState<FurnitureCategory>('All furniture');
  const [expanded, setExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const matching = furniture.filter((item) => category === 'All furniture' || item.category === category);
  const visible = category === 'All furniture' && !expanded ? matching.slice(0, 6) : matching;
  const selected = furniture.find((item) => item.id === selectedId);
  const isOpen = Boolean(selected);

  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => {
      document.body.style.overflow = originalOverflow;
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  function closeDialog() {
    dialogRef.current?.close();
    setSelectedId(null);
  }

  function changeSelection(direction: -1 | 1) {
    const position = matching.findIndex((item) => item.id === selectedId);
    const next = (position + direction + matching.length) % matching.length;
    setSelectedId(matching[next].id);
  }

  return (
    <>
      <div className="collection-controls">
        <div className="collection-filters" role="group" aria-label="Filter furniture by category">
          {furnitureCategories.map((name) => (
            <button
              key={name}
              type="button"
              className="filter-button"
              aria-pressed={name === category}
              aria-controls="furniture-grid"
              onClick={() => {
                setCategory(name);
                setExpanded(false);
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <p className="collection-count" role="status" aria-live="polite" aria-atomic="true">
          {visible.length < matching.length ? `${visible.length} of ${matching.length}` : matching.length} {matching.length === 1 ? 'design' : 'designs'}
        </p>
      </div>

      <div className="product-grid" id="furniture-grid">
        {visible.map((item) => (
          <article className="product-card" key={item.id}>
            <button
              className="product-image-button"
              type="button"
              aria-label={`View ${item.title.toLowerCase()}`}
              aria-haspopup="dialog"
              onClick={() => setSelectedId(item.id)}
            >
              {/* Pre-generated responsive files keep the original product photograph intact. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={`product-image${item.height > item.width * 0.95 ? ' product-image-contain' : ''}`}
                src={furnitureImage(item, 800)}
                srcSet={furnitureImageSet(item)}
                sizes="(max-width: 399px) calc(100vw - 40px), (max-width: 767px) calc((100vw - 55px) / 2), (max-width: 1023px) 45vw, (max-width: 1399px) 30vw, 410px"
                alt={item.alt}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
              />
            </button>
            <div className="product-info">
              <p className="product-category">{item.category}</p>
              <div className="product-title-row">
                <h3 className="product-title">{item.title}</h3>
                <button
                  className="product-open"
                  type="button"
                  aria-label={`View details: ${item.title}`}
                  aria-haspopup="dialog"
                  onClick={() => setSelectedId(item.id)}
                >
                  <ArrowUpRight size={22} weight="regular" aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {category === 'All furniture' && (
        <div className="collection-more">
          <button
            className="button button-outline"
            type="button"
            aria-controls="furniture-grid"
            aria-expanded={expanded}
            onClick={() => setExpanded((previous) => !previous)}
          >
            {expanded ? 'Show fewer designs' : 'View all furniture'} <ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
      )}

      <dialog
        className="product-dialog"
        ref={dialogRef}
        aria-labelledby="furniture-dialog-title"
        aria-describedby="furniture-dialog-description"
        onClose={() => setSelectedId(null)}
        onCancel={() => setSelectedId(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        onKeyDown={(event) => {
          if (matching.length < 2) return;
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            changeSelection(-1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            changeSelection(1);
          }
        }}
      >
        {selected && (
          <div className="dialog-layout">
            <button className="dialog-close icon-button" type="button" aria-label="Close furniture details" onClick={closeDialog} autoFocus>
              <X size={23} aria-hidden="true" />
            </button>
            <div className="dialog-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={furnitureImage(selected)} alt={selected.alt} width={selected.width} height={selected.height} />
            </div>
            <div className="dialog-content">
              <p className="dialog-label">{selected.category}</p>
              <h2 id="furniture-dialog-title">{selected.title}</h2>
              <p id="furniture-dialog-description">{selected.description}</p>
              <a className="button button-primary" href={furnitureEnquiry(selected)} target="_blank" rel="noopener noreferrer">
                <WhatsappLogo size={21} aria-hidden="true" />
                <span>Enquire on WhatsApp <span>+91 8639121227</span></span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              {matching.length > 1 && (
                <div className="dialog-nav" aria-label="Browse furniture photographs">
                  <button className="icon-button" type="button" aria-label="Previous furniture design" onClick={() => changeSelection(-1)}>
                    <ArrowLeft size={21} aria-hidden="true" />
                  </button>
                  <span aria-live="polite">{matching.findIndex((item) => item.id === selected.id) + 1} / {matching.length}</span>
                  <button className="icon-button" type="button" aria-label="Next furniture design" onClick={() => changeSelection(1)}>
                    <ArrowRight size={21} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
