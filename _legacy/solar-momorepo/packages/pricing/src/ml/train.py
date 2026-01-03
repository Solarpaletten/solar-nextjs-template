#!/usr/bin/env python3
# ============================================================
# @solar/pricing - ML Model Training
# Phase 5: Stage B - Gradient Boosting Model
# ============================================================
# 
# Usage:
#   pip install pandas numpy scikit-learn
#   python train.py
#
# Output:
#   model.json - Exported model weights for JS inference
# ============================================================

import json
import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
import warnings

warnings.filterwarnings('ignore')

# ============================================================
# CONFIGURATION
# ============================================================

FEATURE_COLS = [
    'area_sqm',
    'building_levels',
    'type_residential',
    'type_apartments',
    'type_commercial',
    'type_office',
    'type_industrial',
    'centroid_lat',
    'centroid_lng',
    'distance_to_center_km',
    'aggregated_price_sqm',
    'nearby_listings_count',
]

TARGET_COL = 'actual_price_sqm'

MODEL_PARAMS = {
    'n_estimators': 100,
    'max_depth': 5,
    'learning_rate': 0.1,
    'min_samples_split': 10,
    'min_samples_leaf': 5,
    'subsample': 0.8,
    'random_state': 42,
}

OUTPUT_PATH = Path(__file__).parent / 'model.json'


# ============================================================
# DATA LOADING
# ============================================================

def load_training_data() -> pd.DataFrame:
    """
    Load training data from CSV or database.
    
    Expected columns:
    - All FEATURE_COLS
    - actual_price_sqm (target)
    """
    csv_path = Path(__file__).parent / 'training_data.csv'
    
    if csv_path.exists():
        print(f'Loading training data from {csv_path}')
        return pd.read_csv(csv_path)
    
    # Generate synthetic data for initial testing
    print('No training data found, generating synthetic data...')
    return generate_synthetic_data(n_samples=1000)


def generate_synthetic_data(n_samples: int = 1000) -> pd.DataFrame:
    """
    Generate synthetic training data for model testing.
    In production, replace with real data from database.
    """
    np.random.seed(42)
    
    # Berlin Alexanderplatz coordinates
    center_lat, center_lng = 52.5219, 13.4125
    
    data = {
        'area_sqm': np.random.normal(100, 40, n_samples).clip(30, 300),
        'building_levels': np.random.randint(1, 12, n_samples),
        'centroid_lat': np.random.normal(center_lat, 0.01, n_samples),
        'centroid_lng': np.random.normal(center_lng, 0.015, n_samples),
        'aggregated_price_sqm': np.random.normal(6500, 1000, n_samples).clip(4000, 10000),
        'nearby_listings_count': np.random.randint(0, 20, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Building type (one-hot)
    types = np.random.choice(
        ['residential', 'apartments', 'commercial', 'office', 'industrial'],
        n_samples,
        p=[0.4, 0.35, 0.1, 0.1, 0.05]
    )
    df['type_residential'] = (types == 'residential').astype(int)
    df['type_apartments'] = (types == 'apartments').astype(int)
    df['type_commercial'] = (types == 'commercial').astype(int)
    df['type_office'] = (types == 'office').astype(int)
    df['type_industrial'] = (types == 'industrial').astype(int)
    
    # Distance to center
    df['distance_to_center_km'] = np.sqrt(
        ((df['centroid_lng'] - center_lng) * 85) ** 2 +
        ((df['centroid_lat'] - center_lat) * 111) ** 2
    )
    
    # Generate target with realistic coefficients
    base_price = df['aggregated_price_sqm']
    
    # Type multipliers
    type_mult = (
        1.0 * df['type_residential'] +
        1.05 * df['type_apartments'] +
        1.2 * df['type_commercial'] +
        1.15 * df['type_office'] +
        0.7 * df['type_industrial']
    )
    type_mult = type_mult.replace(0, 1)  # default
    
    # Level bonus
    level_bonus = np.minimum((df['building_levels'] - 3).clip(0) * 0.02, 0.15)
    
    # Distance penalty
    dist_penalty = df['distance_to_center_km'] * (-0.03)
    
    # Final price with some noise
    df['actual_price_sqm'] = (
        base_price * type_mult * (1 + level_bonus) * (1 + dist_penalty)
        + np.random.normal(0, 200, n_samples)  # noise
    ).clip(3000, 15000)
    
    return df


# ============================================================
# MODEL TRAINING
# ============================================================

def train_model(df: pd.DataFrame) -> GradientBoostingRegressor:
    """Train Gradient Boosting model."""
    
    print(f'\nDataset: {len(df)} samples')
    print(f'Features: {len(FEATURE_COLS)}')
    
    X = df[FEATURE_COLS]
    y = df[TARGET_COL]
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f'Train: {len(X_train)}, Test: {len(X_test)}')
    
    # Train model
    print('\nTraining...')
    model = GradientBoostingRegressor(**MODEL_PARAMS)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred_train = model.predict(X_train)
    y_pred_test = model.predict(X_test)
    
    print('\n=== Metrics ===')
    print(f'Train MAE: {mean_absolute_error(y_train, y_pred_train):.2f} €/m²')
    print(f'Test MAE:  {mean_absolute_error(y_test, y_pred_test):.2f} €/m²')
    print(f'Test RMSE: {np.sqrt(mean_squared_error(y_test, y_pred_test)):.2f} €/m²')
    print(f'Test R²:   {r2_score(y_test, y_pred_test):.3f}')
    
    # Cross-validation
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='neg_mean_absolute_error')
    print(f'CV MAE:    {-cv_scores.mean():.2f} ± {cv_scores.std():.2f} €/m²')
    
    # Feature importance
    print('\n=== Feature Importance ===')
    importance = pd.DataFrame({
        'feature': FEATURE_COLS,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    print(importance.to_string(index=False))
    
    return model


# ============================================================
# MODEL EXPORT
# ============================================================

def export_model_to_json(model: GradientBoostingRegressor, output_path: Path):
    """
    Export GBM model to JSON for JavaScript inference.
    
    The exported format includes:
    - Tree structures (feature, threshold, children, values)
    - Initial prediction (mean)
    - Learning rate
    """
    
    print(f'\nExporting model to {output_path}...')
    
    model_data = {
        'type': 'gradient_boosting',
        'n_estimators': model.n_estimators,
        'feature_names': FEATURE_COLS,
        'learning_rate': model.learning_rate,
        'initial_prediction': float(model.init_.constant_[0][0]),
        'trees': [],
    }
    
    # Export each tree
    for estimator in model.estimators_.flatten():
        tree = estimator.tree_
        tree_data = {
            'feature': tree.feature.tolist(),
            'threshold': tree.threshold.tolist(),
            'children_left': tree.children_left.tolist(),
            'children_right': tree.children_right.tolist(),
            'value': tree.value.flatten().tolist(),
        }
        model_data['trees'].append(tree_data)
    
    # Write JSON
    with open(output_path, 'w') as f:
        json.dump(model_data, f, indent=2)
    
    # Print file size
    size_kb = output_path.stat().st_size / 1024
    print(f'Model exported: {size_kb:.1f} KB')
    print(f'Trees: {len(model_data["trees"])}')


# ============================================================
# MAIN
# ============================================================

def main():
    print('=' * 60)
    print('@solar/pricing - ML Model Training')
    print('Phase 5: Stage B')
    print('=' * 60)
    
    # Load data
    df = load_training_data()
    
    # Train model
    model = train_model(df)
    
    # Export to JSON
    export_model_to_json(model, OUTPUT_PATH)
    
    print('\n✅ Training complete!')
    print(f'Model saved to: {OUTPUT_PATH}')


if __name__ == '__main__':
    main()
