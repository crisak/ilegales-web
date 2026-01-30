import type { Category } from '@/types/category'

export const categories: Category[] = [
  {
    id: 'grafiti',
    name: 'Grafiti & Arte Urbano',
    slug: 'grafiti',
    description:
      'Todo lo que necesitas para pintar: sprays, caps, marcadores y herramientas profesionales',
    image: '/images/categories/grafiti.jpg',
    icon: '🎨',
    subcategories: [
      {
        id: 'sprays',
        name: 'Latas de Spray',
        slug: 'sprays',
        description: 'Montana, Molotow, Loop y más marcas profesionales',
      },
      {
        id: 'caps',
        name: 'Caps (Boquillas)',
        slug: 'caps',
        description: 'Skinny, fat, calligraphy y sets profesionales',
      },
      {
        id: 'marcadores',
        name: 'Marcadores & Rotuladores',
        slug: 'marcadores',
        description: 'Markers permanentes, mops y paint markers',
      },
      {
        id: 'proteccion',
        name: 'Equipo de Protección',
        slug: 'proteccion',
        description: 'Mascarillas, guantes y gafas de seguridad',
      },
      {
        id: 'herramientas-grafiti',
        name: 'Herramientas & Utilidades',
        slug: 'herramientas-grafiti',
        description: 'Blackbooks, lápices y transporte',
      },
    ],
  },
  {
    id: 'tattoo',
    name: 'Tattoo & Tatuajes',
    slug: 'tattoo',
    description:
      'Equipamiento profesional para tatuadores: máquinas, tintas, agujas y cuidado',
    image: '/images/categories/tattoo.jpg',
    icon: '💉',
    subcategories: [
      {
        id: 'maquinas',
        name: 'Máquinas de Tatuar',
        slug: 'maquinas',
        description: 'Rotary, Coil, Pen y fuentes de alimentación',
      },
      {
        id: 'consumibles-tattoo',
        name: 'Consumibles',
        slug: 'consumibles-tattoo',
        description: 'Agujas, cartuchos y tintas profesionales',
      },
      {
        id: 'higiene',
        name: 'Higiene & Bioseguridad',
        slug: 'higiene',
        description: 'Guantes, cubiertas y jabones antibacterianos',
      },
      {
        id: 'transfer',
        name: 'Diseño & Transfer',
        slug: 'transfer',
        description: 'Papel stencil, lápices térmicos y aplicadores',
      },
      {
        id: 'aftercare',
        name: 'Cuidado Post-Tatuaje',
        slug: 'aftercare',
        description: 'Cremas, protector solar y kits de aftercare',
      },
    ],
  },
  {
    id: 'ropa',
    name: 'Ropa & Moda Urbana',
    slug: 'ropa',
    description:
      'Estilo callejero auténtico: camisetas, hoodies, gorras y calzado',
    image: '/images/categories/ropa.jpg',
    icon: '👕',
    subcategories: [
      {
        id: 'camisetas',
        name: 'Camisetas',
        slug: 'camisetas',
        description: 'Diseños exclusivos y colaboraciones con artistas',
      },
      {
        id: 'hoodies',
        name: 'Hoodies & Sudaderas',
        slug: 'hoodies',
        description: 'Sudaderas con capucha y crew necks',
      },
      {
        id: 'gorras',
        name: 'Gorras & Accesorios',
        slug: 'gorras',
        description: 'Snapbacks, beanies y bandanas',
      },
      {
        id: 'pantalones',
        name: 'Pantalones',
        slug: 'pantalones',
        description: 'Baggy, joggers y shorts',
      },
      {
        id: 'calzado',
        name: 'Calzado',
        slug: 'calzado',
        description: 'Sneakers y ediciones limitadas',
      },
    ],
  },
  {
    id: 'accesorios',
    name: 'Accesorios & Merch',
    slug: 'accesorios',
    description: 'Stickers, parches, pins y todo el merchandising urbano',
    image: '/images/categories/accesorios.jpg',
    icon: '🏷️',
    subcategories: [
      {
        id: 'stickers',
        name: 'Stickers & Adhesivos',
        slug: 'stickers',
        description: 'Packs variados y stickers de artistas',
      },
      {
        id: 'parches',
        name: 'Parches',
        slug: 'parches',
        description: 'Bordados, PVC y con velcro',
      },
      {
        id: 'pins',
        name: 'Pins & Chapas',
        slug: 'pins',
        description: 'Coleccionables y ediciones limitadas',
      },
      {
        id: 'utilitarios',
        name: 'Utilitarios',
        slug: 'utilitarios',
        description: 'Llaveros, fundas y tarjeteros',
      },
    ],
  },
  {
    id: 'musica',
    name: 'Música & DJ',
    slug: 'musica',
    description: 'Vinilos, equipo DJ y todo para la cultura del sonido',
    image: '/images/categories/musica.jpg',
    icon: '🎧',
    subcategories: [
      {
        id: 'vinilos',
        name: 'Vinilos & Discos',
        slug: 'vinilos',
        description: 'Hip Hop clásico, breakbeats y ediciones especiales',
      },
      {
        id: 'equipo-dj',
        name: 'Equipo DJ',
        slug: 'equipo-dj',
        description: 'Controladores, auriculares y fundas',
      },
      {
        id: 'accesorios-musica',
        name: 'Accesorios',
        slug: 'accesorios-musica',
        description: 'Pads, micrófonos y software',
      },
    ],
  },
  {
    id: 'libros',
    name: 'Libros & Revistas',
    slug: 'libros',
    description:
      'Conocimiento urbano: historia del grafiti, técnicas y cultura',
    image: '/images/categories/libros.jpg',
    icon: '📚',
    subcategories: [
      {
        id: 'arte-tecnica',
        name: 'Arte & Técnica',
        slug: 'arte-tecnica',
        description: 'Historia del grafiti y tutoriales',
      },
      {
        id: 'cultura-hiphop',
        name: 'Cultura Hip Hop',
        slug: 'cultura-hiphop',
        description: 'Historias, biografías y fotografía urbana',
      },
      {
        id: 'revistas',
        name: 'Revistas & Fanzines',
        slug: 'revistas',
        description: 'Publicaciones especializadas e independientes',
      },
    ],
  },
  {
    id: 'decoracion',
    name: 'Decoración & Arte',
    slug: 'decoracion',
    description:
      'Lleva el arte urbano a tu espacio: lienzos, vinilos y figuras',
    image: '/images/categories/decoracion.jpg',
    icon: '🖼️',
    subcategories: [
      {
        id: 'arte-pared',
        name: 'Arte en Pared',
        slug: 'arte-pared',
        description: 'Lienzos, cuadros y vinilos decorativos',
      },
      {
        id: 'figuras',
        name: 'Figuras & Vinyl Toys',
        slug: 'figuras',
        description: 'Coleccionables y designer toys',
      },
      {
        id: 'objetos-deco',
        name: 'Objetos Decorativos',
        slug: 'objetos-deco',
        description: 'Alfombras, lámparas y más',
      },
    ],
  },
  {
    id: 'coleccionables',
    name: 'Coleccionables & Rarezas',
    slug: 'coleccionables',
    description: 'Piezas únicas: ediciones limitadas, vintage y arte exclusivo',
    image: '/images/categories/coleccionables.jpg',
    icon: '💎',
    subcategories: [
      {
        id: 'ediciones-limitadas',
        name: 'Ediciones Limitadas',
        slug: 'ediciones-limitadas',
        description: 'Sprays coleccionables y ropa numerada',
      },
      {
        id: 'vintage',
        name: 'Vintage & Retro',
        slug: 'vintage',
        description: 'Ropa vintage y material descatalogado',
      },
      {
        id: 'arte-exclusivo',
        name: 'Arte Exclusivo',
        slug: 'arte-exclusivo',
        description: 'Prints firmados y piezas únicas',
      },
    ],
  },
]
