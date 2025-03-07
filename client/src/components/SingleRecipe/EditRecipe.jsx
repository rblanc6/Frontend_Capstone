import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetRecipeQuery } from "./SingleRecipeSlice";
import {
  useUpdateRecipeMutation,
  useGetCategoriesQuery,
} from "../Recipes/RecipesSlice";

export default function EditRecipeForm({ onCancel, setIsEditing }) {
  const { data: category, isSuccess: categorySuccess } =
    useGetCategoriesQuery();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  const { id } = useParams();
  const {
    data: currentRecipe,
    error: fetchError,
    isLoading,
  } = useGetRecipeQuery(id);

  useEffect(() => {
    if (categorySuccess) {
      setCategories(category);
    }
  }, [category, categorySuccess]);

  useEffect(() => {
    console.log("Selected Categories on load:", selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    console.log(value);
    console.log(checked);
    const numValu = +value;
    let temp = [...selectedCategory];
    const found = temp.indexOf(numValu);
    if (found !== -1) {
      temp = [...temp.filter((element) => element !== numValu)];
    } else {
      temp.push(numValu);
    }
    setSelectedCategory(temp);

    // setSelectedCategory((prevSelected) => {
    //   if (checked) {
    //     return [...prevSelected, value];
    //   } else {
    //     return prevSelected.filter((categoryId) => categoryId !== value);
    //   }
    // });
  };

  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: [],
    categories: [],
    photo: "",
    creatorId: "",
  });
  const [error, setError] = useState(null);

  const [updateRecipe, { isLoading: isUpdating, error: updateError }] =
    useUpdateRecipeMutation();

  const [removedIngredientIds, setRemovedIngredientIds] = useState([]);
  const [removedInstructionIds, setRemovedInstructionIds] = useState([]);

  useEffect(() => {
    if (currentRecipe) {
      console.log("Current Recipe Ingredients: ", currentRecipe.ingredient);

      const filteredIngredients = currentRecipe.ingredient.filter(
        (ingredient) => !removedIngredientIds.includes(ingredient.id)
      );

      const filteredInstructions = currentRecipe.instructions.filter(
        (instruction) => !removedInstructionIds.includes(instruction.id)
      );

      setRecipe({
        name: currentRecipe.name,
        description: currentRecipe.description,
        ingredients: filteredIngredients.map((ing) => ({
          id: ing.id,
          name: ing.ingredient.name,
          quantity: ing.quantity,
          unitName: ing.unit.name,
        })),
        instructions: filteredInstructions || [],
        categories: currentRecipe.categories || [],
        photo: currentRecipe.photo,
        creatorId: currentRecipe.creatorId,
      });

      setSelectedCategory(currentRecipe.categories?.map((cat) => cat.id) || []);
    }
  }, [currentRecipe, removedIngredientIds, removedInstructionIds]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const newIngredients = [...recipe.ingredients];
    newIngredients[index][name] = value;
    setRecipe((prevState) => ({
      ...prevState,
      ingredients: newIngredients,
    }));
  };
  const handleAddIngredient = () => {
    setRecipe((prevState) => ({
      ...prevState,
      ingredients: [
        ...prevState.ingredients,
        { name: "", quantity: "", unitName: "" },
      ],
    }));
  };

  const handleRemoveIngredient = (index) => {
    const removedIngredient = recipe.ingredients[index];
    if (removedIngredient.id) {
      setRemovedIngredientIds((prev) => [...prev, removedIngredient.id]);
    }
    const newIngredients = [...recipe.ingredients];
    newIngredients.splice(index, 1);
    setRecipe((prevState) => ({
      ...prevState,
      ingredients: newIngredients,
    }));
  };

  const handleInstructionChange = (index, e) => {
    const { value } = e.target;
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = { instruction: value };
    setRecipe((prevState) => ({
      ...prevState,
      instructions: newInstructions,
    }));
  };
  const handleAddInstruction = () => {
    setRecipe((prevState) => ({
      ...prevState,
      instructions: [...prevState.instructions, { instruction: "" }],
    }));
  };

  const handleRemoveInstruction = (index) => {
    const removedInstruction = recipe.instructions[index];
    if (removedInstruction.id) {
      setRemovedInstructionIds((prev) => [...prev, removedInstruction.id]);
    }
    const newInstructions = [...recipe.instructions];
    newInstructions.splice(index, 1);
    setRecipe((prevState) => ({
      ...prevState,
      instructions: newInstructions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with selected categories:", selectedCategory);

    const updatedInstructions = recipe.instructions.filter(
      (inst) => !inst.id || !removedInstructionIds.includes(inst.id)
    );
    const newIngredients = recipe.ingredients.filter((ing) => !ing.id);
    const removedCategoryIds = currentRecipe.categories
      .filter((cat) => !selectedCategory.includes(cat.id))
      .map((cat) => cat.id);

    const updatedData = {
      name: recipe.name,
      description: recipe.description,
      ingredients: newIngredients,
      instructions: updatedInstructions,
      categories: selectedCategory,
      photo: recipe.photo,
      creatorId: recipe.creatorId,
      removedIngredientIds: Array.from(removedIngredientIds),
      removedInstructionIds: Array.from(removedInstructionIds),
      removedCategoryIds: removedCategoryIds,
    };

    try {
      const { data } = await updateRecipe({
        id: id,
        updatedData: updatedData,
      });

      if (data) {
        alert("Recipe updated successfully!");
        onCancel();
      }
    } catch (error) {
      setError(error.message || "Error updating recipe");
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (fetchError) return <p>{fetchError.message || "Error fetching recipe"}</p>;
  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          {updateError && (
            <div className="alert alert-danger">{updateError.message}</div>
          )}
          <div>
            <label>
              <h4>Name</h4>
            </label>
            <br />
            <input
              className="form-control"
              type="text"
              name="name"
              value={recipe.name}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <label>
              <h4>Description</h4>
            </label>
            <br />
            <textarea
              className="form-control"
              name="description"
              value={recipe.description}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <label>
              <h4>Photo URL</h4>
            </label>
            <br />
            <input
              className="form-control"
              type="text"
              name="photo"
              value={recipe.photo}
              onChange={handleChange}
            />
          </div>
          <div className="mt-3">
            <label>
              <h4>Ingredients</h4>
            </label>
            <br />
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index}>
                <input
                  type="text"
                  name="name"
                  value={ingredient.name}
                  placeholder="Ingredient Name"
                  onChange={(e) => handleIngredientChange(index, e)}
                />
                <input
                  type="number"
                  name="quantity"
                  value={ingredient.quantity}
                  placeholder="Quantity"
                  onChange={(e) => handleIngredientChange(index, e)}
                />
                <input
                  type="text"
                  name="unitName"
                  value={ingredient.unitName}
                  placeholder="Unit Name"
                  onChange={(e) => handleIngredientChange(index, e)}
                />
                <button
                  className="btn btn-secondary btn-sm mt-1 mb-3"
                  type="button"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  Remove Ingredient
                </button>
              </div>
            ))}
            <button
              className="btn btn-secondary btn-sm mt-3"
              type="button"
              onClick={handleAddIngredient}
            >
              Add Ingredient
            </button>
          </div>
          <div className="mt-3">
            <label>
              <h4>Instructions</h4>
            </label>
            <br />
            {recipe.instructions.map((instruction, index) => (
              <div key={index}>
                <textarea
                  name="instructions"
                  className="form-control"
                  value={instruction.instruction}
                  onChange={(e) => handleInstructionChange(index, e)}
                />
                <button
                  className="btn btn-secondary btn-sm mt-1"
                  type="button"
                  onClick={() => handleRemoveInstruction(index)}
                >
                  Remove Instruction
                </button>
              </div>
            ))}
            <button
              className="btn btn-secondary btn-sm mt-3"
              type="button"
              onClick={handleAddInstruction}
            >
              Add Instruction
            </button>
          </div>
          <div className="dropdown mt-3">
            <h4>Categories</h4>

            {categories.map((category) => (
              <div className="form-check form-check-inline" key={category.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`category-${category.id}`}
                  value={category.id}
                  checked={selectedCategory.includes(category.id)}
                  onChange={handleCategoryChange}
                  name={category.name}
                />
                <label
                  className="form-check-label"
                  htmlFor={`category-${category.id}`}
                >
                  {category.name}
                </label>
                {/* <p>{selectedCategory.includes(category.id) ? 'checked' : 'unchecked'}</p> */}
              </div>
            ))}
            {/* <select
            className="form-select"
            id="category"
            value={selectedCategory}
            multiple
            size="6"
            aria-label="Multiple select example"
            onChange={handleCategoryChange}
          >
            <option disabled>Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select> */}
          </div>
          <button
            type="submit"
            disabled={isUpdating}
            className="button-details mt-4"
          >
            {isUpdating ? "Updating..." : "Update Recipe"}
          </button>
          &nbsp;
          <button
            type="button"
            className="button-details mt-4"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </form>
      </div>
    </>
  );
}
