"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Layers,
  Sparkles,
  ArrowUpDown,
  Tag,
  ShieldCheck,
  Save,
} from "lucide-react";
import { AdminNav } from "@/components/admin/AdminNav";
import { useProducts } from "@/context/ProductContext";
import { Product, ProductStatus, PrintingPosition, ProductColor, VolumeDiscount } from "@/types/products";
import { CATEGORIES } from "@/data/categories";
import { saveArtworkFile } from "@/lib/indexedDb";

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const { products, addProduct, updateProduct, deleteProduct, suppliers } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formCategory, setFormCategory] = useState("promo-tekstil");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formFullDesc, setFormFullDesc] = useState("");
  const [formPriceFrom, setFormPriceFrom] = useState(5.0);
  const [formMinQuantity, setFormMinQuantity] = useState(25);
  const [formIncrement, setFormIncrement] = useState(5);
  const [formStock, setFormStock] = useState(500);
  const [formLocalStock, setFormLocalStock] = useState(200);
  const [formSupplierStock, setFormSupplierStock] = useState(300);
  const [formStatus, setFormStatus] = useState<ProductStatus>("published");
  const [formAllowPersonalization, setFormAllowPersonalization] = useState(true);
  const [formManualOverride, setFormManualOverride] = useState(true);
  const [formSupplierId, setFormSupplierId] = useState<"supplier-a" | "supplier-b" | "none">("none");
  const [formPurchasePrice, setFormPurchasePrice] = useState(3.0);
  const [formDeliveryTime, setFormDeliveryTime] = useState("4–6 delovnih dni z dotiskom");
  const [formMaterials, setFormMaterials] = useState("100% bombaž");
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formColors, setFormColors] = useState<ProductColor[]>([]);
  const [formSizes, setFormSizes] = useState<string[]>([]);
  const [formTiers, setFormTiers] = useState<VolumeDiscount[]>([]);
  const [formPrintingPositions, setFormPrintingPositions] = useState<PrintingPosition[]>([]);

  // New color / tier inputs
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [newTierQty, setNewTierQty] = useState("");
  const [newTierPrice, setNewTierPrice] = useState("");
  const [newSize, setNewSize] = useState("");
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Handle URL query parameters for direct open
  useEffect(() => {
    const editId = searchParams.get("edit");
    const action = searchParams.get("action");
    const filter = searchParams.get("filter");

    if (filter === "needs_review") {
      setSelectedStatus("needs_review");
    }

    if (action === "new") {
      openNewProductModal();
    } else if (editId) {
      const found = products.find((p) => p.id === editId);
      if (found) {
        openEditProductModal(found);
      }
    }
  }, [searchParams, products]);

  const openNewProductModal = () => {
    setIsNew(true);
    setEditingProduct(null);
    setFormName("");
    setFormSku(`AZ-NEW-${Math.floor(100 + Math.random() * 900)}`);
    setFormCategory("promo-tekstil");
    setFormShortDesc("");
    setFormFullDesc("");
    setFormPriceFrom(6.5);
    setFormMinQuantity(25);
    setFormIncrement(5);
    setFormStock(500);
    setFormLocalStock(200);
    setFormSupplierStock(300);
    setFormStatus("published");
    setFormAllowPersonalization(true);
    setFormManualOverride(true);
    setFormSupplierId("none");
    setFormPurchasePrice(3.8);
    setFormDeliveryTime("4–6 delovnih dni");
    setFormMaterials("Reciklirani eko materiali");
    setFormImages([
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    ]);
    setFormColors([
      { name: "Poslovno modra", hex: "#1e3a5f" },
      { name: "Črna", hex: "#0f172a" },
    ]);
    setFormSizes(["S", "M", "L", "XL"]);
    setFormTiers([
      { qty: "25–49 kos", price: 7.5 },
      { qty: "50–99 kos", price: 6.9 },
      { qty: "100+ kos", price: 6.5 },
    ]);
    setFormPrintingPositions([
      {
        id: "spredaj",
        name: "Spredaj sredina",
        description: "Glavna pozicija za logotip",
        maxPrintArea: "100 × 60 mm (demo)",
        technique: "Laserska gravura ali sitotisk",
        dashedArea: { top: "30%", left: "30%", width: "40%", height: "40%" },
      },
    ]);
    setIsModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setIsNew(false);
    setEditingProduct(product);
    setFormName(product.name);
    setFormSku(product.sku);
    setFormCategory(product.category);
    setFormShortDesc(product.shortDescription || "");
    setFormFullDesc(product.fullDescription || "");
    setFormPriceFrom(product.priceFrom);
    setFormMinQuantity(product.minQuantity);
    setFormIncrement(product.quantityIncrement || 5);
    setFormStock(product.stock);
    setFormLocalStock(product.localStock || 0);
    setFormSupplierStock(product.supplierStock || product.stock);
    setFormStatus(product.status || "published");
    setFormAllowPersonalization(product.allowPersonalization !== false);
    setFormManualOverride(product.manualPriceOverride ?? true);
    setFormSupplierId((product.supplierId as any) || "none");
    setFormPurchasePrice(product.supplierPurchasePrice || product.priceFrom * 0.6);
    setFormDeliveryTime(product.deliveryTime);
    setFormMaterials(product.materials);
    setFormImages([...product.images]);
    setFormColors(product.colors ? [...product.colors] : []);
    setFormSizes(product.sizes ? [...product.sizes] : []);
    setFormTiers(product.volumeDiscounts ? [...product.volumeDiscounts] : []);
    setFormPrintingPositions(product.printingPositions ? [...product.printingPositions] : []);
    setIsModalOpen(true);
  };

  // Image file upload handler using IndexedDB
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const record = await saveArtworkFile(file, {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      if (record.dataUrl) {
        setFormImages([record.dataUrl, ...formImages]);
        setUploadNotice(`Slika »${file.name}« je bila shranjena v lokalni IndexedDB in dodana k predogledu.`);
      } else {
        setUploadNotice(`Datoteka »${file.name}« shranjena.`);
      }
      setTimeout(() => setUploadNotice(null), 4000);
    } catch (err) {
      console.error("Failed to upload image", err);
      alert("Napaka pri branju slike v brskalniku.");
    }
  };

  // Save product changes
  const handleSaveProduct = (targetStatus?: ProductStatus) => {
    if (!formName.trim() || !formSku.trim()) {
      alert("Vnesite naziv in SKU izdelka.");
      return;
    }

    const catObj = CATEGORIES.find((c) => c.slug === formCategory);
    const categoryName = catObj ? catObj.name : "Promo izdelki";
    const statusToSave = targetStatus || formStatus;

    const productPayload: Product = {
      id: isNew ? `prd-${Date.now()}` : editingProduct!.id,
      sku: formSku.trim(),
      name: formName.trim(),
      category: formCategory,
      categoryName,
      shortDescription: formShortDesc,
      fullDescription: formFullDesc,
      priceFrom: parseFloat(formPriceFrom.toString()) || 1.0,
      minQuantity: parseInt(formMinQuantity.toString()) || 10,
      quantityIncrement: parseInt(formIncrement.toString()) || 1,
      stock: parseInt(formStock.toString()) || 100,
      localStock: parseInt(formLocalStock.toString()) || 0,
      supplierStock: parseInt(formSupplierStock.toString()) || 0,
      status: statusToSave,
      vatRate: 22,
      priceVatIncluded: false,
      allowPersonalization: formAllowPersonalization,
      manualPriceOverride: formManualOverride,
      supplierId: formSupplierId === "none" ? null : formSupplierId,
      supplierName:
        formSupplierId === "supplier-a"
          ? "Demo dobavitelj A (PromoTextile Europe)"
          : formSupplierId === "supplier-b"
          ? "Demo dobavitelj B (TechPromo Direct)"
          : undefined,
      supplierPurchasePrice: parseFloat(formPurchasePrice.toString()) || undefined,
      deliveryTime: formDeliveryTime,
      materials: formMaterials,
      images: formImages.length > 0 ? formImages : ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"],
      colors: formColors,
      sizes: formSizes.length > 0 ? formSizes : undefined,
      volumeDiscounts: formTiers,
      printingPositions: formPrintingPositions,
      printTechniques: formPrintingPositions.map((p) => p.technique),
      suitableFor: editingProduct?.suitableFor || ["Poslovna darila", "Zaposleni"],
      specs: editingProduct?.specs || { "Material": formMaterials, "DDV status": "Brez DDV" },
      relatedProductIds: editingProduct?.relatedProductIds || ["tek-01", "home-01"],
    };

    if (isNew) {
      addProduct(productPayload);
    } else {
      updateProduct(editingProduct!.id, productPayload);
    }

    setIsModalOpen(false);
  };

  // Color add/remove
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setFormColors([...formColors, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName("");
  };

  const handleRemoveColor = (index: number) => {
    setFormColors(formColors.filter((_, i) => i !== index));
  };

  // Size add/remove
  const handleAddSize = () => {
    if (!newSize.trim()) return;
    setFormSizes([...formSizes, newSize.trim()]);
    setNewSize("");
  };

  const handleRemoveSize = (index: number) => {
    setFormSizes(formSizes.filter((_, i) => i !== index));
  };

  // Tier add/remove
  const handleAddTier = () => {
    if (!newTierQty.trim() || !newTierPrice.trim()) return;
    setFormTiers([
      ...formTiers,
      { qty: newTierQty.trim(), price: parseFloat(newTierPrice) || 0 },
    ]);
    setNewTierQty("");
    setNewTierPrice("");
  };

  const handleRemoveTier = (index: number) => {
    setFormTiers(formTiers.filter((_, i) => i !== index));
  };

  // Printing position add/remove
  const handleAddPrintingPosition = () => {
    const newPos: PrintingPosition = {
      id: `pos-${Date.now()}`,
      name: "Nova tiskarska pozicija",
      description: "Opis pozicije za tisk ali lasersko gravuro",
      maxPrintArea: "80 × 40 mm (demo)",
      technique: "Sitotisk ali gravura",
      dashedArea: { top: "30%", left: "30%", width: "40%", height: "40%" },
    };
    setFormPrintingPositions([...formPrintingPositions, newPos]);
  };

  const handleRemovePrintingPosition = (id: string) => {
    setFormPrintingPositions(formPrintingPositions.filter((p) => p.id !== id));
  };

  // Filtering
  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || prod.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all"
        ? true
        : selectedStatus === "published"
        ? prod.status === "published" || !prod.status
        : prod.status === selectedStatus;
    const matchesSupplier =
      selectedSupplier === "all"
        ? true
        : selectedSupplier === "none"
        ? !prod.supplierId
        : prod.supplierId === selectedSupplier;

    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AdminNav />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-brand-700" />
              Upravljanje izdelkov in cen
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Urejanje prodajnih cen, minimalnih količin, tiskarskih pozicij in povezav z dobavitelji.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewProductModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-semibold text-sm shadow-sm transition-all hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Nov izdelek</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Išči po nazivu ali SKU..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-600 focus:border-transparent bg-slate-50"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-600 bg-slate-50 text-slate-700"
              >
                <option value="all">Vse kategorije</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-600 bg-slate-50 text-slate-700"
              >
                <option value="all">Vsi statusi</option>
                <option value="published">Objavljeni v trgovini</option>
                <option value="needs_review">Potreben pregled (novo)</option>
                <option value="draft">Osnutki (skrito)</option>
              </select>
            </div>

            {/* Supplier Filter */}
            <div>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-600 bg-slate-50 text-slate-700"
              >
                <option value="all">Vsi viri (lastni in dobavitelji)</option>
                <option value="none">Samo ročno vneseni (brez dobavitelja)</option>
                <option value="supplier-a">Demo dobavitelj A (PTE)</option>
                <option value="supplier-b">Demo dobavitelj B (TPD)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Prikazujem <strong>{filteredProducts.length}</strong> od skupno {products.length} izdelkov
            </span>
            {(searchQuery || selectedCategory !== "all" || selectedStatus !== "all" || selectedSupplier !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedStatus("all");
                  setSelectedSupplier("all");
                }}
                className="text-brand-600 hover:underline font-medium"
              >
                Počisti filtre
              </button>
            )}
          </div>
        </div>

        {/* Product Catalog Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Izdelek</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Kategorija</th>
                  <th className="py-3 px-4">Prodajna cena</th>
                  <th className="py-3 px-4">Min. količina</th>
                  <th className="py-3 px-4">Zaloga</th>
                  <th className="py-3 px-4">Dobavitelj / Vir</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Akcije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <Link
                            href={`/izdelki/${prod.id}`}
                            target="_blank"
                            className="font-bold text-slate-900 hover:text-brand-700 transition-colors block truncate max-w-xs"
                            title="Odpri izdelek v spletni trgovini"
                          >
                            {prod.name}
                          </Link>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">
                            {prod.colors?.length ? `${prod.colors.length} barv` : "Enobarvno"} •{" "}
                            {prod.printingPositions?.length
                              ? `${prod.printingPositions.length} tiskarskih pozicij`
                              : "Brez definiranih pozicij"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-slate-700">
                      {prod.sku}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-medium">
                        {prod.categoryName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {prod.priceFrom.toFixed(2)} €
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        brez DDV (z DDV: {(prod.priceFrom * 1.22).toFixed(2)} €)
                      </span>
                      {prod.manualPriceOverride && (
                        <span className="inline-flex items-center text-[9px] font-bold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded mt-0.5">
                          Ročna cena zaščitena
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">
                        {prod.minQuantity} kos
                      </span>
                      {prod.quantityIncrement && (
                        <span className="text-[10px] text-slate-400 block">
                          korak: +{prod.quantityIncrement}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">
                        {prod.stock} kos
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {prod.localStock !== undefined ? `Lastna: ${prod.localStock}` : ""}
                        {prod.supplierStock !== undefined ? ` | Dob.: ${prod.supplierStock}` : ""}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {prod.supplierId ? (
                        <div>
                          <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                            {prod.supplierId === "supplier-a" ? "Dobavitelj A" : "Dobavitelj B"}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            SKU: {prod.supplierSku || "—"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-medium text-[11px]">
                          Lasten vnos
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.status === "published" || !prod.status
                            ? "bg-emerald-100 text-emerald-800"
                            : prod.status === "needs_review"
                            ? "bg-amber-100 text-amber-800 animate-pulse"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {prod.status === "published" || !prod.status
                          ? "Objavljeno"
                          : prod.status === "needs_review"
                          ? "Potreben pregled"
                          : "Osnutek"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/izdelki/${prod.id}`}
                          target="_blank"
                          title="Poglej na spletni strani"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => openEditProductModal(prod)}
                          title="Uredi izdelek"
                          className="p-1.5 rounded-lg text-brand-700 hover:text-brand-900 hover:bg-brand-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Ali res želite izbrisati izdelek »${prod.name}«?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          title="Izbriši izdelek"
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit / Create Product Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 my-8">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50 rounded-t-2xl">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {isNew ? "Dodaj nov izdelek v katalog" : `Urejanje izdelka: ${editingProduct?.name}`}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Spremembe se shranijo v lokalno demo bazo in so takoj vidne v spletni trgovini.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
                {/* Notice message */}
                {uploadNotice && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl">
                    {uploadNotice}
                  </div>
                )}

                {/* Section 1: Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1">
                    1. Osnovni podatki izdelka
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-semibold text-slate-700">Naziv izdelka *</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs"
                        placeholder="npr. Eko Bento posoda za malico z bambusovim pokrovom"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">SKU koda *</label>
                      <input
                        type="text"
                        value={formSku}
                        onChange={(e) => setFormSku(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs font-mono"
                        placeholder="AZ-HOM-504"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Kategorija</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Materiali</label>
                      <input
                        type="text"
                        value={formMaterials}
                        onChange={(e) => setFormMaterials(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs"
                        placeholder="npr. Naravni bambus, recikliran PP, nerjaveče jeklo"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Kratek opis (za kartice in povzetke)</label>
                    <textarea
                      rows={2}
                      value={formShortDesc}
                      onChange={(e) => setFormShortDesc(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs"
                      placeholder="Kratek prepričljiv opis prednosti..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Celoten opis (podrobna stran izdelka)</label>
                    <textarea
                      rows={3}
                      value={formFullDesc}
                      onChange={(e) => setFormFullDesc(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs"
                      placeholder="Podroben opis z vsemi tehničnimi podatki..."
                    />
                  </div>
                </div>

                {/* Section 2: Pricing, Quantities & VAT */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1 flex items-center justify-between">
                    <span>2. Cene, količinski popusti in DDV</span>
                    <span className="text-[11px] font-normal text-slate-400">
                      Vse cene so v EUR brez DDV (+22%)
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Prodajna cena »od« (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formPriceFrom}
                        onChange={(e) => setFormPriceFrom(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs font-bold"
                      />
                      <span className="text-[10px] text-slate-400">
                        Z DDV: {(formPriceFrom * 1.22).toFixed(2)} €
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Minimalna količina</label>
                      <input
                        type="number"
                        value={formMinQuantity}
                        onChange={(e) => setFormMinQuantity(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Količinski korak (+kos)</label>
                      <input
                        type="number"
                        value={formIncrement}
                        onChange={(e) => setFormIncrement(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Čas dobave</label>
                      <input
                        type="text"
                        value={formDeliveryTime}
                        onChange={(e) => setFormDeliveryTime(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs"
                        placeholder="npr. 4–6 delovnih dni"
                      />
                    </div>
                  </div>

                  {/* Manual price override protection */}
                  <div className="flex items-center gap-2 p-3 bg-brand-50/70 border border-brand-100 rounded-xl">
                    <input
                      type="checkbox"
                      id="manualOverride"
                      checked={formManualOverride}
                      onChange={(e) => setFormManualOverride(e.target.checked)}
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <label htmlFor="manualOverride" className="font-semibold text-brand-900 cursor-pointer">
                      Zaščiti mojo prodajno ceno: Sinhronizacija dobavitelja NE sme prepisati te cene.
                    </label>
                  </div>

                  {/* Volume discounts tiers */}
                  <div className="space-y-2">
                    <label className="font-semibold text-slate-700 block">
                      Količinski popusti (razredi)
                    </label>
                    <div className="space-y-2">
                      {formTiers.map((tier, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <span className="font-semibold text-slate-800 w-32">{tier.qty}</span>
                          <span className="font-bold text-brand-700">{tier.price.toFixed(2)} € brez DDV</span>
                          <span className="text-[10px] text-slate-400">({(tier.price * 1.22).toFixed(2)} € z DDV)</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTier(idx)}
                            className="ml-auto text-rose-500 hover:text-rose-700 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="npr. 250–499 kos"
                        value={newTierQty}
                        onChange={(e) => setNewTierQty(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs w-40"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Cena €"
                        value={newTierPrice}
                        onChange={(e) => setNewTierPrice(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs w-28"
                      />
                      <button
                        type="button"
                        onClick={handleAddTier}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                      >
                        + Dodaj razred
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 3: Stock & Supplier link */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1">
                    3. Zaloga in povezava z dobavitelji
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Vir / Dobavitelj</label>
                      <select
                        value={formSupplierId}
                        onChange={(e) => setFormSupplierId(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs"
                      >
                        <option value="none">Brez (Lastna proizvodnja / neposredno)</option>
                        <option value="supplier-a">Demo dobavitelj A (PromoTextile Europe)</option>
                        <option value="supplier-b">Demo dobavitelj B (TechPromo Direct)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Nabavna cena dobavitelja (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formPurchasePrice}
                        onChange={(e) => setFormPurchasePrice(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs"
                      />
                      <span className="text-[10px] text-amber-700 font-medium">
                        * Zaupno — nikoli se ne prikaže strankam
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Skupna zaloga (kos)</label>
                      <input
                        type="number"
                        value={formStock}
                        onChange={(e) => setFormStock(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Personalization & Printing Positions */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <h3 className="text-sm font-bold text-slate-900">
                      4. Možnosti tiska in pozicije za logotip
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-brand-900">
                      <input
                        type="checkbox"
                        checked={formAllowPersonalization}
                        onChange={(e) => setFormAllowPersonalization(e.target.checked)}
                        className="w-4 h-4 rounded text-brand-600"
                      />
                      <span>Omogoči tisk na tem izdelku</span>
                    </label>
                  </div>

                  {formAllowPersonalization && (
                    <div className="space-y-3">
                      <div className="text-xs text-slate-500">
                        Določite pozicije, ki jih stranka lahko izbere (npr. Pokrov, Desna stran, Leva stran, Prsa levo):
                      </div>

                      <div className="space-y-3">
                        {formPrintingPositions.map((pos, pIdx) => (
                          <div
                            key={pos.id}
                            className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <input
                                type="text"
                                value={pos.name}
                                onChange={(e) => {
                                  const updated = [...formPrintingPositions];
                                  updated[pIdx].name = e.target.value;
                                  setFormPrintingPositions(updated);
                                }}
                                className="font-bold text-slate-900 px-2 py-1 bg-white border border-slate-200 rounded text-xs flex-1"
                                placeholder="Naziv pozicije (npr. Pokrov)"
                              />
                              <input
                                type="text"
                                value={pos.maxPrintArea}
                                onChange={(e) => {
                                  const updated = [...formPrintingPositions];
                                  updated[pIdx].maxPrintArea = e.target.value;
                                  setFormPrintingPositions(updated);
                                }}
                                className="px-2 py-1 bg-white border border-slate-200 rounded text-xs w-40"
                                placeholder="Maks. dimenzija"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemovePrintingPosition(pos.id)}
                                className="text-rose-500 hover:text-rose-700 font-bold px-2 py-1"
                              >
                                Izbriši
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={pos.technique}
                                onChange={(e) => {
                                  const updated = [...formPrintingPositions];
                                  updated[pIdx].technique = e.target.value;
                                  setFormPrintingPositions(updated);
                                }}
                                className="px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                placeholder="Tehnika (npr. Laserska gravura ali sitotisk)"
                              />
                              <input
                                type="text"
                                value={pos.description}
                                onChange={(e) => {
                                  const updated = [...formPrintingPositions];
                                  updated[pIdx].description = e.target.value;
                                  setFormPrintingPositions(updated);
                                }}
                                className="px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                placeholder="Opis za stranko"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleAddPrintingPosition}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
                      >
                        + Dodaj novo tiskarsko pozicijo
                      </button>
                    </div>
                  )}
                </div>

                {/* Section 5: Variants (Colors & Sizes) */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1">
                    5. Barvne in velikostne različice
                  </h3>

                  {/* Colors */}
                  <div className="space-y-2">
                    <label className="font-semibold text-slate-700 block">Barvne različice</label>
                    <div className="flex flex-wrap gap-2">
                      {formColors.map((col, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-white shadow-2xs"
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span className="font-medium">{col.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(cIdx)}
                            className="text-slate-400 hover:text-rose-500 font-bold ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Ime barve (npr. Antracit)"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={(e) => setNewColorHex(e.target.value)}
                        className="w-8 h-8 rounded border border-slate-200 p-0.5 cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={handleAddColor}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                      >
                        + Dodaj barvo
                      </button>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="space-y-2 pt-2">
                    <label className="font-semibold text-slate-700 block">Velikosti (tekstil)</label>
                    <div className="flex flex-wrap gap-1.5">
                      {formSizes.map((sz, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 bg-slate-100 rounded text-xs font-mono flex items-center gap-1"
                        >
                          {sz}
                          <button
                            type="button"
                            onClick={() => handleRemoveSize(sIdx)}
                            className="text-slate-400 hover:text-rose-500 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="npr. 2XL"
                        value={newSize}
                        onChange={(e) => setNewSize(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs w-28"
                      />
                      <button
                        type="button"
                        onClick={handleAddSize}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                      >
                        + Dodaj velikost
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 6: Images & Local IndexedDB Upload */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-1">
                    6. Slike izdelka & lokalno nalaganje
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formImages.map((imgUrl, iIdx) => (
                      <div key={iIdx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square">
                        <img src={imgUrl} alt="Slika izdelka" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormImages(formImages.filter((_, idx) => idx !== iIdx))}
                          className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Odstrani sliko"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <label className="border-2 border-dashed border-slate-200 hover:border-brand-500 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer transition-colors p-2 text-center">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="font-semibold text-slate-700 text-[11px]">Naloži sliko</span>
                      <span className="text-[9px] text-slate-400">IndexedDB blob</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Section 7: Publishing status */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    7. Status objave
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 flex-1">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={formStatus === "published"}
                        onChange={() => setFormStatus("published")}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Objavljeno (Aktivno)</div>
                        <div className="text-[11px] text-slate-500">Vidno vsem kupcem v spletni trgovini</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 flex-1">
                      <input
                        type="radio"
                        name="status"
                        value="needs_review"
                        checked={formStatus === "needs_review"}
                        onChange={() => setFormStatus("needs_review")}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <div className="font-bold text-amber-900">Potreben pregled</div>
                        <div className="text-[11px] text-slate-500">Čaka na potrditev lastnika</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 flex-1">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={formStatus === "draft"}
                        onChange={() => setFormStatus("draft")}
                        className="text-slate-600 focus:ring-slate-500"
                      />
                      <div>
                        <div className="font-bold text-slate-900">Osnutek (Skrito)</div>
                        <div className="text-[11px] text-slate-500">Ni vidno kupcem</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 flex items-center justify-between shrink-0 bg-slate-50 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Prekliči
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveProduct("draft")}
                    className="px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Shrani kot osnutek
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveProduct("published")}
                    className="px-5 py-2 font-bold text-white bg-brand-700 hover:bg-brand-800 rounded-xl shadow-sm transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Shrani in objavi izdelek</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-sm text-slate-500">
          Nalaganje kataloga izdelkov...
        </div>
      }
    >
      <AdminProductsContent />
    </Suspense>
  );
}
