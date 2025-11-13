import React, { useState, useEffect } from 'react';
import { ShoppingCart, Store, User, Plus, X, Search, Phone } from 'lucide-react';

export default function EcommerceWhatsApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Formulaire vendeur
  const [vendorForm, setVendorForm] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    storeName: '',
    description: ''
  });

  // Formulaire produit
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    vendorId: ''
  });

  // Charger les données au démarrage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const vendorsData = await window.storage.get('vendors');
      const productsData = await window.storage.get('products');

      if (vendorsData) setVendors(JSON.parse(vendorsData.value));
      if (productsData) setProducts(JSON.parse(productsData.value));
    } catch (error) {
      console.log('Première visite - initialisation des données');
    }
  };

  const saveVendors = async (newVendors) => {
    await window.storage.set('vendors', JSON.stringify(newVendors));
    setVendors(newVendors);
  };

  const saveProducts = async (newProducts) => {
    await window.storage.set('products', JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const handleVendorSubmit = async () => {
    if (!vendorForm.name || !vendorForm.email || !vendorForm.phone || 
        !vendorForm.whatsapp || !vendorForm.storeName || !vendorForm.description) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newVendor = {
      id: Date.now().toString(),
      ...vendorForm,
      createdAt: new Date().toISOString()
    };

    await saveVendors([...vendors, newVendor]);

    setVendorForm({
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      storeName: '',
      description: ''
    });

    alert('Inscription réussie ! Vous pouvez maintenant ajouter vos produits.');
    setCurrentPage('add-product');
  };

  const handleProductSubmit = async () => {
    if (!productForm.name || !productForm.price || !productForm.category || 
        !productForm.description || !productForm.vendorId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      ...productForm,
      createdAt: new Date().toISOString()
    };

    await saveProducts([...products, newProduct]);

    setProductForm({
      name: '',
      price: '',
      category: '',
      description: '',
      image: '',
      vendorId: ''
    });

    alert('Produit ajouté avec succès !');
  };

  const handleBuyNow = (product) => {
    const vendor = vendors.find(v => v.id === product.vendorId);
    if (vendor && vendor.whatsapp) {
      const message = `Bonjour, je suis intéressé(e) par: ${product.name} - ${product.price} FCFA`;
      const whatsappUrl = `https://wa.me/${vendor.whatsapp.replace(/\\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <ShoppingCart className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MarketPlace
              </h1>
            </div>

            <nav className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentPage('home')}
                className="px-4 py-2 rounded-lg hover:bg-purple-50 transition"
              >
                Boutique
              </button>
              <button
                onClick={() => setCurrentPage('vendor-signup')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
              >
                <Store className="w-4 h-4" />
                <span>Devenir vendeur</span>
              </button>
              <button
                onClick={() => setCurrentPage('add-product')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter produit</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && (
          <div>
            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full ${
                    selectedCategory === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Tous
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucun produit disponible pour le moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => {
                  const vendor = vendors.find(v => v.id === product.vendorId);
                  return (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-1">
                      <div className="h-48 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingCart className="w-16 h-16 text-purple-400" />
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 text-gray-800">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-2xl font-bold text-purple-600">{product.price} FCFA</span>
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                        </div>

                        {vendor && (
                          <div className="mb-3 text-sm text-gray-500 flex items-center space-x-1">
                            <Store className="w-4 h-4" />
                            <span>{vendor.storeName}</span>
                          </div>
                        )}

                        <button
                          onClick={() => handleBuyNow(product)}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition flex items-center justify-center space-x-2 font-semibold"
                        >
                          <Phone className="w-5 h-5" />
                          <span>Acheter via WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentPage === 'vendor-signup' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center space-x-2">
                <Store className="w-8 h-8 text-purple-600" />
                <span>Inscription Vendeur</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={vendorForm.name}
                    onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus;border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={vendorForm.email}
                    onChange={(e) => setVendorForm({...vendorForm, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus;border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={vendorForm.phone}
                    onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus;border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp (avec indicatif pays, ex: 221776543210)
                  </label>
                  <input
                    type="tel"
                    value={vendorForm.whatsapp}
                    onChange={(e) => setVendorForm({...vendorForm, whatsapp: e.target.value})}
                    placeholder="221776543210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus;border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique</label>
                  <input
                    type="text"
                    value={vendorForm.storeName}
                    onChange={(e) => setVendorForm({...vendorForm, storeName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus;border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={vendorForm.description}
                    onChange={(e) => setVendorForm({...vendorForm, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus;border-transparent"
                  />
                </div>

                <button
                  onClick={handleVendorSubmit}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition font-semibold"
                >
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'add-product' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center space-x-2">
                <Plus className="w-8 h-8 text-green-600" />
                <span>Ajouter un produit</span>
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendeur</label>
                  <select
                    value={productForm.vendorId}
                    onChange={(e) => setProductForm({...productForm, vendorId: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un vendeur</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.storeName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    placeholder="Ex: Vêtements, Électronique, Alimentation..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image (optionnel)</label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleProductSubmit}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold"
                >
                  Ajouter le produit
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2025 MarketPlace - Plateforme e-commerce avec intégration WhatsApp</p>
        </div>
      </footer>
    </div>
  );
}
