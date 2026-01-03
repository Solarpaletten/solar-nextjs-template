import type { 
  FillLayerSpecification, 
  LineLayerSpecification,
  FillExtrusionLayerSpecification 
} from 'mapbox-gl';

// ============================================================
// LAYER IDs
// ============================================================

export const HOUSES_SOURCE_ID = 'houses-source';
export const HOUSES_FILL_LAYER_ID = 'houses-fill';
export const HOUSES_LINE_LAYER_ID = 'houses-line';
export const HOUSES_3D_LAYER_ID = 'houses-3d';

// ============================================================
// ZOOM THRESHOLD FOR 3D
// ============================================================

export const ZOOM_3D_THRESHOLD = 15;

// ============================================================
// COLOR PALETTE — SATELLITE PREMIUM (Mercedes Me style)
// ============================================================
// Мягкие, приглушённые цвета поверх спутника
// Не перекрывают реальные фото крыш

export const BUILDING_COLORS_SATELLITE = {
  // Жилые — тёплые тона черепицы
  residential: '#b85c38',
  apartments: '#a35231',
  house: '#c76b45',
  
  // Коммерческие — серый бетон/стекло
  commercial: '#8d8d8d',
  retail: '#7a7a7a',
  
  // Офисы — холодный серый
  office: '#6f7782',
  
  // Индустриальные — тёмный коричневый
  industrial: '#5a4a42',
  warehouse: '#4d4039',
  
  // Default — нейтральный
  default: '#9b9b9b',
};

// ============================================================
// 2D FILL LAYER — Minimal on satellite (zoom < 15)
// ============================================================
// На сателлите 2D fill почти невидим — здания видны на фото

export const housesFillLayer: FillLayerSpecification = {
  id: HOUSES_FILL_LAYER_ID,
  type: 'fill',
  source: HOUSES_SOURCE_ID,
  maxzoom: ZOOM_3D_THRESHOLD,
  paint: {
    // Очень низкая opacity — только лёгкая подсветка при hover
    'fill-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#ffffff',
      'transparent',
    ],
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.2,
      0,
    ],
  },
};

// ============================================================
// LINE LAYER — Контуры зданий (тонкие, premium)
// ============================================================

export const housesLineLayer: LineLayerSpecification = {
  id: HOUSES_LINE_LAYER_ID,
  type: 'line',
  source: HOUSES_SOURCE_ID,
  paint: {
    'line-color': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      '#ffffff',
      ['boolean', ['feature-state', 'selected'], false],
      '#4ade80',
      'rgba(255, 255, 255, 0.5)',
    ],
    'line-width': [
      'interpolate',
      ['linear'],
      ['zoom'],
      14, 0.5,
      16, 1,
      18, 1.5,
    ],
  },
};

// ============================================================
// 3D EXTRUSION LAYER — Premium satellite style
// ============================================================

export const houses3DLayer: FillExtrusionLayerSpecification = {
  id: HOUSES_3D_LAYER_ID,
  type: 'fill-extrusion',
  source: HOUSES_SOURCE_ID,
  minzoom: ZOOM_3D_THRESHOLD,
  paint: {
    // Приглушённые цвета — спутник виден сквозь
    'fill-extrusion-color': [
      'case',
      // Hover — белый акцент
      ['boolean', ['feature-state', 'hover'], false],
      '#ffffff',
      // Selected — зелёный акцент
      ['boolean', ['feature-state', 'selected'], false],
      '#4ade80',
      // По типу здания — тёплые тона
      [
        'match',
        ['get', 'building_type'],
        'residential', BUILDING_COLORS_SATELLITE.residential,
        'apartments', BUILDING_COLORS_SATELLITE.apartments,
        'house', BUILDING_COLORS_SATELLITE.house,
        'commercial', BUILDING_COLORS_SATELLITE.commercial,
        'retail', BUILDING_COLORS_SATELLITE.retail,
        'office', BUILDING_COLORS_SATELLITE.office,
        'industrial', BUILDING_COLORS_SATELLITE.industrial,
        'warehouse', BUILDING_COLORS_SATELLITE.warehouse,
        BUILDING_COLORS_SATELLITE.default,
      ],
    ],
    
    // Высота: этажи × 3 метра
    'fill-extrusion-height': [
      '*',
      ['coalesce', ['get', 'building_levels'], 2],
      3,
    ],
    
    // База на земле
    'fill-extrusion-base': 0,
    
    // КЛЮЧЕВОЕ: низкая opacity чтобы спутник был виден
    'fill-extrusion-opacity': [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      0.55, // Ярче при hover
      ['boolean', ['feature-state', 'selected'], false],
      0.6,  // Ярче при select
      0.35, // Базовая — полупрозрачная
    ],
    
    // Вертикальный градиент для глубины
    'fill-extrusion-vertical-gradient': true,
  },
};

// ============================================================
// HELPER: Get all layer IDs for event handling
// ============================================================

export const ALL_HOUSE_LAYERS = [
  HOUSES_FILL_LAYER_ID,
  HOUSES_3D_LAYER_ID,
];
