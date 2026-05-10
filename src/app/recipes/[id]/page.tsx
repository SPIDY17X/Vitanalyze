"use client";

import { useParams } from "next/navigation";

const recipes = [
  {
    id: "1",
    name: "Quinoa Veggie Bowl",
    description: "Healthy quinoa with veggies.",
    ingredients: ["Quinoa", "Veggies", "Beans"],
    steps: ["Cook quinoa", "Mix veggies", "Serve"],
  },
  {
    id: "2",
    name: "Lemon Herb Salmon",
    description: "Tasty grilled salmon.",
    ingredients: ["Salmon", "Lemon"],
    steps: ["Season", "Grill", "Serve"],
  },
  {
    id: "3",
    name: "Sweet Potato Toast",
    description: "Healthy toast.",
    ingredients: ["Sweet potato", "Avocado"],
    steps: ["Slice", "Bake", "Serve"],
  },
  {
    id: "4",
    name: "Berry Smoothie Bowl",
    description: "Fresh smoothie bowl.",
    ingredients: ["Berries", "Milk"],
    steps: ["Blend", "Serve"],
  },
];

export default function RecipeDetail() {
  const params = useParams();
  const recipe = recipes.find((r) => r.id === params.id);

  if (!recipe) return <div>Not found</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">{recipe.name}</h1>

      <p className="mt-2">{recipe.description}</p>

      <h2 className="mt-4 font-semibold">Ingredients</h2>
      <ul className="list-disc ml-6">
        {recipe.ingredients.map((i, index) => (
          <li key={index}>{i}</li>
        ))}
      </ul>

      <h2 className="mt-4 font-semibold">Steps</h2>
      <ol className="list-decimal ml-6">
        {recipe.steps.map((s, index) => (
          <li key={index}>{s}</li>
        ))}
      </ol>
    </div>
  );
}