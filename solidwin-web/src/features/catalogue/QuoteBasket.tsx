"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { BLOCK_PAVER_PRODUCTS, type BlockPaverProduct } from "@/data/hardware";
import styles from "./QuoteBasket.module.css";

interface BasketItem {
  product: BlockPaverProduct;
  quantity: number;
}

export function BlocksPaversCatalogue() {
  const [filter, setFilter] = useState<"all" | "blocks" | "pavers">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [basket, setBasket] = useState<BasketItem[]>([]);

  const filtered = BLOCK_PAVER_PRODUCTS.filter((p) => {
    const matchesFilter = filter === "all" || p.category === filter;
    const matchesSearch =
      searchTerm === "" ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.applications.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getQty = (id: string) => quantities[id] ?? 100;

  const setQty = (id: string, val: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, val) }));
  };

  const addToBasket = (product: BlockPaverProduct) => {
    const qty = getQty(product.id);
    setBasket((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromBasket = (productId: string) => {
    setBasket((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const basketQuery = encodeURIComponent(
    basket.map((item) => `${item.quantity} ${item.product.unit} of ${item.product.name}`).join("; ")
  );

  return (
    <div className={styles.container}>
      {/* Search and Category Filter Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <input
            type="search"
            placeholder="Search blocks, pavers, dimensions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterTabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${filter === "all" ? styles.activeTab : ""}`}
            onClick={() => setFilter("all")}
          >
            All Products
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${filter === "blocks" ? styles.activeTab : ""}`}
            onClick={() => setFilter("blocks")}
          >
            Concrete Blocks
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${filter === "pavers" ? styles.activeTab : ""}`}
            onClick={() => setFilter("pavers")}
          >
            Paving Stones
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Product Cards Grid */}
        <div className={styles.productsGrid}>
          {filtered.map((prod) => (
            <article key={prod.id} className={styles.productCard}>
              <div className={styles.media}>
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  sizes="(min-width: 1024px) 300px, 100vw"
                  className={styles.img}
                />
                <span className={styles.badge}>{prod.category}</span>
              </div>

              <div className={styles.content}>
                <h3 className={styles.prodName}>{prod.name}</h3>
                <dl className={styles.specs}>
                  <div>
                    <dt>Size</dt>
                    <dd>{prod.dimensionsMm}</dd>
                  </div>
                  <div>
                    <dt>Strength</dt>
                    <dd>{prod.compressiveStrength}</dd>
                  </div>
                </dl>
                <p className={styles.appText}>{prod.applications}</p>

                <div className={styles.orderRow}>
                  <div className={styles.qtyControl}>
                    <button
                      type="button"
                      onClick={() => setQty(prod.id, getQty(prod.id) - 50)}
                      className={styles.qtyBtn}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      step="10"
                      value={getQty(prod.id)}
                      onChange={(e) => setQty(prod.id, parseInt(e.target.value, 10) || 1)}
                      className={styles.qtyInput}
                    />
                    <button
                      type="button"
                      onClick={() => setQty(prod.id, getQty(prod.id) + 50)}
                      className={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToBasket(prod)}
                    className={styles.addBtn}
                  >
                    + Add to Quote
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Floating/Sidebar Quote Basket (as seen on Figma canvas) */}
        <aside className={styles.basketSidebar} aria-label="Quote basket">
          <div className={styles.basketHeader}>
            <h3 className={styles.basketTitle}>Your Quote Basket</h3>
            <span className={styles.basketCount}>{basket.length} items</span>
          </div>

          {basket.length === 0 ? (
            <div className={styles.emptyBasket}>
              <p>No products added yet.</p>
              <p className={styles.emptySub}>
                Select blocks or pavers to build your bulk supply quote.
              </p>
            </div>
          ) : (
            <div className={styles.basketContent}>
              <ul className={styles.basketList}>
                {basket.map((item) => (
                  <li key={item.product.id} className={styles.basketItem}>
                    <div>
                      <h4 className={styles.itemTitle}>{item.product.name}</h4>
                      <span className={styles.itemQty}>
                        Qty: {item.quantity.toLocaleString()} {item.product.unit}s
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromBasket(item.product.id)}
                      className={styles.removeBtn}
                      aria-label={`Remove ${item.product.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>

              <div className={styles.basketCta}>
                <Button
                  href={`/request-quote?service=hardware&items=${basketQuery}`}
                  withArrow
                >
                  Request Bulk Quote
                </Button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
