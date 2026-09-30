"use client";

import React, { useState } from "react";
import { Check, UtensilsCrossed } from "lucide-react";

interface IngredientItem {
  item: string;
  quantity: string;
  unit?: string;
}

interface RecipeIngredientsListProps {
  ingredients: IngredientItem[];
}

export function RecipeIngredientsList({ ingredients }: RecipeIngredientsListProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  function toggleCheck(index: number) {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }

  if (ingredients.length === 0) {
    return <p className="text-xs text-stone-500">Nenhum ingrediente listado.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-orange-600" />
          <span>Ingredientes</span>
        </h2>
        <span className="text-[11px] text-stone-400 font-medium">
          {Object.values(checkedItems).filter(Boolean).length}/{ingredients.length} separados
        </span>
      </div>

      <p className="text-[11px] text-stone-500">
        Toque no ingrediente para marcar como separado enquanto você cozinha.
      </p>

      <ul className="space-y-2">
        {ingredients.map((ing, idx) => {
          const isChecked = Boolean(checkedItems[idx]);

          return (
            <li
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                isChecked
                  ? "bg-stone-50 border-stone-200 text-stone-400 line-through"
                  : "bg-white hover:bg-orange-50/50 border-stone-100 text-stone-800"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isChecked
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-stone-300 bg-white"
                }`}
              >
                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              <div className="text-xs sm:text-sm leading-tight flex-1">
                {(ing.quantity || ing.unit) && (
                  <span className="font-bold text-orange-950 mr-1.5">
                    {ing.quantity} {ing.unit}
                  </span>
                )}
                <span>{ing.item}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
