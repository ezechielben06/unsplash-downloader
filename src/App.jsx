import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Grid,
  Filter,
  Settings,
  Camera,
  Loader,
  Heart,
  User,
  Eye,
  CheckCircle,
  Circle,
  Zap,
  Star,
} from "lucide-react";

const UnsplashDownloader = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("nature");
  const [imageCount, setImageCount] = useState(12);
  const [resolution, setResolution] = useState("regular");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [hoveredImage, setHoveredImage] = useState(null);
  const [imageSeed, setImageSeed] = useState(Date.now()); // Nouvel état pour forcer le rechargement

  // Remplacez cette clé par votre propre clé API Unsplash
  const ACCESS_KEY = "YOURKEY_UNSPLASH_ACCESS_";

  // truekey = "sVTR-GNe0wJEtIwx8VUxBh_xXJqPQ1CNgL3aN9dELe4";

  const categories = [
    {
      id: "nature",
      name: "Nature",
      emoji: "🌿",
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: "city",
      name: "Ville",
      emoji: "🏙️",
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "technology",
      name: "Tech",
      emoji: "💻",
      color: "from-purple-500 to-violet-600",
    },
    {
      id: "food",
      name: "Food",
      emoji: "🍕",
      color: "from-orange-500 to-red-600",
    },
    {
      id: "travel",
      name: "Voyage",
      emoji: "✈️",
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: "business",
      name: "Business",
      emoji: "💼",
      color: "from-gray-500 to-slate-600",
    },
    {
      id: "people",
      name: "People",
      emoji: "👥",
      color: "from-pink-500 to-rose-600",
    },
    {
      id: "art",
      name: "Art",
      emoji: "🎨",
      color: "from-yellow-500 to-orange-600",
    },
  ];

  const resolutions = [
    { id: "thumb", name: "Petite", size: "200px", badge: "S" },
    { id: "small", name: "Moyenne", size: "400px", badge: "M" },
    { id: "regular", name: "HD", size: "1080px", badge: "HD" },
    { id: "full", name: "4K Ultra", size: "Original", badge: "4K" },
  ];

  // Fonction pour récupérer les images depuis l'API Unsplash
  const fetchImagesFromAPI = async (query, count) => {
    try {
      let url;

      if (query) {
        url = `https://api.unsplash.com/search/photos?query=${query}&per_page=${count}&client_id=${ACCESS_KEY}`;
      } else {
        url = `https://api.unsplash.com/photos/random?count=${count}&client_id=${ACCESS_KEY}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (query) {
        // Pour les recherches
        return data.results.map((img, index) => ({
          id: img.id,
          urls: img.urls,
          alt_description: img.alt_description || `Image ${index + 1}`,
          user: {
            name: img.user.name,
            profile_image: img.user.profile_image?.medium,
            verified: img.user.for_hire,
          },
          likes: img.likes,
          views: img.views || Math.floor(Math.random() * 50000) + 1000,
          downloads: img.downloads || Math.floor(Math.random() * 10000) + 500,
          tags: img.tags ? img.tags.map((tag) => tag.title) : [query],
        }));
      } else {
        // Pour les images aléatoires
        return data.map((img, index) => ({
          id: img.id,
          urls: img.urls,
          alt_description: img.alt_description || `Image ${index + 1}`,
          user: {
            name: img.user.name,
            profile_image: img.user.profile_image?.medium,
            verified: img.user.for_hire,
          },
          likes: img.likes,
          views: img.views || Math.floor(Math.random() * 50000) + 1000,
          downloads: img.downloads || Math.floor(Math.random() * 10000) + 500,
          tags: img.tags
            ? img.tags.map((tag) => tag.title)
            : [selectedCategory],
        }));
      }
    } catch (error) {
      console.error("Erreur API Unsplash:", error);
      throw error;
    }
  };

  // Générer des données d'images de secours avec un seed aléatoire
  const generateMockImages = (category, count) => {
    const photographers = [
      "Alex Chen",
      "Maria Santos",
      "David Kim",
      "Sarah Johnson",
      "Michael Brown",
      "Emma Wilson",
      "James Lee",
      "Lisa Wang",
      "Carlos Martinez",
      "Ana Silva",
    ];

    const descriptions = {
      nature: [
        "Magnifique coucher de soleil",
        "Forêt mystérieuse",
        "Montagne majestueuse",
        "Lac cristallin",
      ],
      city: [
        "Gratte-ciel au crépuscule",
        "Rue animée la nuit",
        "Architecture moderne",
        "Lumières urbaines",
      ],
      technology: [
        "Setup futuriste",
        "Code élégant",
        "Interface moderne",
        "Innovation technologique",
      ],
      food: [
        "Plat gastronomique",
        "Cuisine créative",
        "Saveurs authentiques",
        "Art culinaire",
      ],
      travel: [
        "Destination exotique",
        "Aventure épique",
        "Culture locale",
        "Paysage à couper le souffle",
      ],
      business: [
        "Environnement professionnel",
        "Innovation business",
        "Leadership inspirant",
        "Croissance stratégique",
      ],
      people: [
        "Portrait authentique",
        "Émotion pure",
        "Connexion humaine",
        "Expression naturelle",
      ],
      art: [
        "Création artistique",
        "Vision créative",
        "Expression moderne",
        "Art contemporain",
      ],
    };

    const mockImages = [];
    for (let i = 1; i <= count; i++) {
      const photographer =
        photographers[Math.floor(Math.random() * photographers.length)];
      const desc = descriptions[category] || descriptions.nature;
      const description = desc[Math.floor(Math.random() * desc.length)];

      // Utilisation de imageSeed pour rendre les images uniques à chaque chargement
      mockImages.push({
        id: `${category}-${i}-${imageSeed}`,
        urls: {
          thumb: `https://picsum.photos/400/600?random=${category}-${i}-${imageSeed}-thumb`,
          small: `https://picsum.photos/800/1200?random=${category}-${i}-${imageSeed}-small`,
          regular: `https://picsum.photos/1200/1800?random=${category}-${i}-${imageSeed}-regular`,
          full: `https://picsum.photos/2000/3000?random=${category}-${i}-${imageSeed}-full`,
        },
        alt_description: `${description} ${i}`,
        user: {
          name: photographer,
          profile_image: `https://i.pravatar.cc/100?u=${photographer}-${imageSeed}`,
          verified: Math.random() > 0.7,
        },
        likes: Math.floor(Math.random() * 2000) + 100,
        views: Math.floor(Math.random() * 50000) + 1000,
        downloads: Math.floor(Math.random() * 10000) + 500,
        tags:
          category === "nature"
            ? ["nature", "landscape", "outdoor"]
            : category === "city"
            ? ["urban", "architecture", "street"]
            : [category, "professional", "creative"],
      });
    }
    return mockImages;
  };

  const searchImages = async () => {
    setLoading(true);
    try {
      // D'abord essayer de récupérer depuis l'API Unsplash
      const query = searchTerm || selectedCategory;
      const apiImages = await fetchImagesFromAPI(query, imageCount);
      setImages(apiImages);
    } catch (error) {
      // En cas d'erreur, utiliser les images mock
      console.log("Utilisation des images mock en raison d'une erreur API");
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const query = searchTerm || selectedCategory;
      const mockData = generateMockImages(query, imageCount);
      setImages(mockData);
    } finally {
      setLoading(false);
      setSelectedImages(new Set());
    }
  };

  useEffect(() => {
    searchImages();
  }, [selectedCategory, imageCount, imageSeed]); // Ajout de imageSeed comme dépendance

  const downloadImage = async (image, filename) => {
    try {
      const response = await fetch(image.urls[resolution]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `unsplash-${image.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    }
  };

  const downloadSelected = async () => {
    const selectedImagesList = images.filter((img) =>
      selectedImages.has(img.id)
    );
    for (const image of selectedImagesList) {
      await downloadImage(image, `unsplash-${image.id}.jpg`);
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  };

  const toggleImageSelection = (imageId) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

  const selectAllImages = () => {
    setSelectedImages(new Set(images.map((img) => img.id)));
  };

  // Fonction pour recharger avec de nouvelles images
  const reloadWithNewImages = () => {
    setImageSeed(Date.now()); // Change le seed pour forcer le rechargement des images
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Premium */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Unsplash Pro
                </h1>
                <p className="text-sm text-gray-600 mt-1">Downloader Premium</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Images haute qualité</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-purple-500" />
                <span>Téléchargement illimité</span>
              </div>
              <button
                onClick={reloadWithNewImages}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
              >
                Nouvelles images
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Panel de contrôle premium */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-gray-200/50 shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Recherche avancée */}
            <div className="xl:col-span-5">
              <label className="block text-gray-800 font-semibold mb-3 flex items-center">
                <Search className="w-5 h-5 mr-2 text-blue-600" />
                Recherche avancée
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Découvrez des images exceptionnelles..."
                  className="w-full px-5 py-4 bg-white/80 border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                  onKeyPress={(e) => e.key === "Enter" && searchImages()}
                />
                <button
                  onClick={searchImages}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-xl"
                >
                  Rechercher
                </button>
              </div>
            </div>

            {/* Contrôles */}
            <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-800 font-semibold mb-3 flex items-center">
                  <Grid className="w-5 h-5 mr-2 text-purple-600" />
                  Quantité
                </label>
                <select
                  value={imageCount}
                  onChange={(e) => setImageCount(parseInt(e.target.value))}
                  className="w-full px-4 py-4 bg-white/80 border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                >
                  {[6, 12, 24, 36, 50].map((count) => (
                    <option key={count} value={count}>
                      {count} images premium
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-800 font-semibold mb-3 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-indigo-600" />
                  Qualité
                </label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-4 py-4 bg-white/80 border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                >
                  {resolutions.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.name} • {res.size}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Catégories premium */}
          <div className="mt-8">
            <label className="block text-gray-800 font-semibold mb-4 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-emerald-600" />
              Collections curées
            </label>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setSearchTerm("");
                  }}
                  className={`relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-xl`
                      : "bg-white/60 text-gray-700 hover:bg-white/80 shadow-lg hover:shadow-xl"
                  }`}
                >
                  <span className="text-lg mr-2">{category.emoji}</span>
                  {category.name}
                  {selectedCategory === category.id && (
                    <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bouton pour nouvelles images (version mobile) */}
          <div className="mt-8 lg:hidden">
            <button
              onClick={reloadWithNewImages}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Charger de nouvelles images
            </button>
          </div>
        </div>
        {/* Panel de sélection */}
        {selectedImages.size > 0 && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-6 mb-8 text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {selectedImages.size} images sélectionnées
                  </h3>
                  <p className="text-emerald-100">
                    Prêtes pour le téléchargement
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={selectAllImages}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-medium transition-all"
                >
                  Tout sélectionner
                </button>
                <button
                  onClick={() => setSelectedImages(new Set())}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-2xl font-medium transition-all"
                >
                  Désélectionner
                </button>
                <button
                  onClick={downloadSelected}
                  className="px-8 py-3 bg-white text-emerald-600 hover:bg-gray-50 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  Télécharger tout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grille d'images premium */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-purple-200 rounded-full animate-ping mx-auto"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Chargement des images premium
              </h3>
              <p className="text-gray-600">
                Préparation de votre collection...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                onMouseEnter={() => setHoveredImage(image.id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                {/* Image container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={image.urls.small}
                    alt={image.alt_description}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Quality badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                        resolution === "full"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600"
                          : resolution === "regular"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                          : "bg-gradient-to-r from-gray-600 to-slate-600"
                      }`}
                    >
                      {resolutions.find((r) => r.id === resolution)?.badge}
                    </span>
                  </div>

                  {/* Selection indicator */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => toggleImageSelection(image.id)}
                      className={`w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center ${
                        selectedImages.has(image.id)
                          ? "bg-emerald-500 text-white shadow-lg scale-110"
                          : "bg-white/80 text-gray-600 hover:bg-white hover:scale-110 shadow-lg"
                      }`}
                    >
                      {selectedImages.has(image.id) ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Hover overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
                      hoveredImage === image.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-center mb-4">
                        <button
                          onClick={() => downloadImage(image)}
                          className="bg-white/90 hover:bg-white text-gray-900 px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <Download className="w-4 h-4" />
                          Télécharger
                        </button>
                      </div>

                      {/* Quick stats */}
                      <div className="flex justify-between text-white text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{(image.views / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span>{image.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          <span>{(image.downloads / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {image.alt_description}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={image.user.profile_image}
                        alt={image.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium text-gray-700">
                          {image.user.name}
                        </span>
                        {image.user.verified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {image.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer premium */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Unsplash Pro</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                La plateforme premium pour télécharger des images de haute
                qualité avec une interface moderne et professionnelle.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Fonctionnalités</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Téléchargement haute résolution</li>
                <li>• Collections curées</li>
                <li>• Interface intuitive</li>
                <li>• Téléchargement par lots</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Qualité</h4>
              <ul className="space-y-2 text-gray-400">
                <li>• Images 4K Ultra</li>
                <li>• Photographes vérifiés</li>
                <li>• Licence commerciale</li>
                <li>• Support 24/7</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Unsplash Pro Downloader - Conçu avec passion pour les
              créatifs
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UnsplashDownloader;
