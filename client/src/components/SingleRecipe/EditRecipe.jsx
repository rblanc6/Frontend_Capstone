import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetRecipeQuery } from "./SingleRecipeSlice";
import { useUpdateRecipeMutation } from "../Recipes/RecipesSlice";

export default function EditRecipeForm() {
  const { recipeId } = useParams();
  const {
    data: currentRecipe,
    error: fetchError,
    isLoading,
  } = useGetRecipeQuery(recipeId);

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

  console.log("Recipe ID from URL:", recipeId); // Ensure this is not undefined

  // Use the updateRecipe mutation hook
  const [updateRecipe, { isLoading: isUpdating, error: updateError }] =
    useUpdateRecipeMutation();

  // When currentRecipe data is fetched, populate the form fields
  useEffect(() => {
    if (currentRecipe) {
      setRecipe({
        name: currentRecipe.name,
        description: currentRecipe.description,
        ingredients: currentRecipe.ingredients.map((ingredient) => ({
          name: ingredient.name,
          quantity: ingredient.quantity,
          unitName: ingredient.unit.name,
        })),
        instructions: currentRecipe.instructions,
        categories: currentRecipe.categories,
        photo: currentRecipe.photo,
        creatorId: currentRecipe.creatorId, // Ensure this comes from the backend or user context
      });
    }
  }, [currentRecipe]);

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
    const newIngredients = [...recipe.ingredients];
    newIngredients.splice(index, 1);
    setRecipe((prevState) => ({
      ...prevState,
      ingredients: newIngredients,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      name: recipe.name,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      categories: recipe.categories,
      photo: recipe.photo,
      creatorId: recipe.creatorId,
    };

    try {
      const { data, error } = await updateRecipe({ id: recipeId, updatedData });

      if (data) {
        alert("Recipe updated successfully!");
      }

      if (error) {
        setError("Error updating recipe");
      }
    } catch (err) {
      setError("Error updating recipe");
    }
  };

  if (isLoading) return <p>Loading...</p>;

  if (fetchError) return <p>{fetchError.message || "Error fetching recipe"}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={recipe.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={recipe.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Photo URL</label>
        <input
          type="text"
          name="photo"
          value={recipe.photo}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Ingredients</label>
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
            <button type="button" onClick={() => handleRemoveIngredient(index)}>
              Remove Ingredient
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient}>
          Add Ingredient
        </button>
      </div>

      <div>
        <label>Instructions</label>
        <textarea
          name="instructions"
          value={recipe.instructions.join(", ")}
          onChange={(e) =>
            setRecipe({ ...recipe, instructions: e.target.value.split(", ") })
          }
        />
      </div>

      <div>
        <label>Categories (comma separated)</label>
        <input
          type="text"
          name="categories"
          value={recipe.categories.join(", ")}
          onChange={(e) => {
            const categories = e.target.value
              .split(",")
              .map((cat) => cat.trim());
            setRecipe({ ...recipe, categories });
          }}
        />
      </div>

      <button type="submit" disabled={isUpdating}>
        {isUpdating ? "Updating..." : "Update Recipe"}
      </button>
    </form>

    /* <div className="card-body">
              <form>
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </label>

                <div className="dropdown">
                  <select
                    className="form-select"
                    id="category"
                    value={selectedCategory}
                    multiple
                    size="6"
                    aria-label="Multiple select example"
                    onChange={handleCategoryChange}
                  >
                    <option disabled>Categories</option>
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <label>
                  Description:
                  <textarea
                    rows="5"
                    cols="40"
                    name="description"
                    value={formData?.description}
                    onChange={handleInputChange}
                  />
                </label>
                <br />
                <button type="button" onClick={handleSaveClick}>
                  Save
                </button>
                <button type="button" onClick={handleCancelClick}>
                  Cancel
                </button>
              </form>
            </div> */
  );
}
