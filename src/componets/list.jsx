import React, { useState, useEffect } from 'react';
import Header from './Header';

const API_KEY = '16d42f48-a895-44cb-87ea-d1e85e1d046f'; // Your API key

const List = () => {
  const [ingredients, setIngredients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('chicken'); // Default category
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${selectedCategory}&key=${API_KEY}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.recipes.length === 0) {
          setIngredients([]);
        } else {
          setIngredients(data.recipes.map(recipe => ({
            name: recipe.title,
            price: (Math.random() * 9 + 1).toFixed(2), // Dummy price for illustration
            image: recipe.image_url
          })));
        }
      } catch (error) {
        console.error('Error fetching ingredients:', error);
        setIngredients([]);
      }
    };

    fetchIngredients();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to the first page when changing category
  };

  const filteredIngredients = ingredients; // No additional filtering needed

  const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
  const currentItems = filteredIngredients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const addToCart = (ingredient) => {
    setCart((prevCart) => [...prevCart, ingredient]);
  };

  const removeFromCart = (ingredientToRemove) => {
    setCart((prevCart) => prevCart.filter((ingredient) => ingredient !== ingredientToRemove));
  };

  const totalPrice = cart.reduce((total, ingredient) => total + parseFloat(ingredient.price), 0);

  return (
    <div className="list-wrapper">
      <Header />
      <main className="list-container">
        <h1 className="list-title">Recipe Ingredients with Prices</h1>
        <div className="categories">
          <button 
            onClick={() => handleCategoryChange('chicken')} 
            className={selectedCategory === 'chicken' ? 'active' : ''}
          >
            Chicken
          </button>
          <button 
            onClick={() => handleCategoryChange('pizza')} 
            className={selectedCategory === 'pizza' ? 'active' : ''}
          >
            Pizza
          </button>
          <button 
            onClick={() => handleCategoryChange('beef')} 
            className={selectedCategory === 'beef' ? 'active' : ''}
          >
            Beef
          </button>
          <button 
            onClick={() => handleCategoryChange('dessert')} 
            className={selectedCategory === 'dessert' ? 'active' : ''}
          >
            Dessert
          </button>
        </div>
        
        {ingredients.length === 0 ? (
          <p className="no-results">No results found for the selected category.</p>
        ) : (
          <>
            <ul className="ingredient-list">
              {currentItems.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  <img src={ingredient.image} alt={ingredient.name} className="ingredient-image" />
                  <div className="ingredient-details">
                    <span className="ingredient-name">{ingredient.name}</span>
                    <span className="ingredient-price">${ingredient.price}</span>
                  </div>
                  <button className="add-to-cart-button" onClick={() => addToCart(ingredient)}>Add to Cart</button>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="pagination-buttons">
                <button 
                  className="previous-button" 
                  onClick={handlePreviousPage} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button 
                  className="next-button" 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        <div className="cart-container">
          <h2 className="cart-title">Cart</h2>
          {cart.length === 0 ? (
            <p className="cart-empty">Your cart is empty</p>
          ) : (
            <ul className="cart-list">
              {cart.map((ingredient, index) => (
                <li key={index} className="cart-item">
                  <span className="cart-item-name">{ingredient.name}</span>
                  <span className="cart-item-price">${ingredient.price}</span>
                  <button className="remove-from-cart-button" onClick={() => removeFromCart(ingredient)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
          <div className="cart-total">
            Total: ${totalPrice.toFixed(2)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default List;
