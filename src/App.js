import React, { useState, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('general');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('newest'); 
  const [user, setUser] = useState(null); 
  const [savedArticles, setSavedArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=0de4303c4676489bae0c504a821ca0b9`);
      const data = await result.json();
      setArticles(data.articles);
    };

    fetchData();
    const savedNews = JSON.parse(localStorage.getItem('savedArticles')) || [];
    setSavedArticles(savedNews);
  }, [category]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(filter) ||
    article.description.toLowerCase().includes(filter)
  );

  const sortedArticles = filteredArticles.sort((a, b) => {
    if (sort === 'newest') {
      return new Date(b.publishedAt) - new Date(a.publishedAt);
    } else if (sort === 'oldest') {
      return new Date(a.publishedAt) - new Date(b.publishedAt);
    } else {
      return a.title.localeCompare(b.title); 
    }
  });

  const handleLoginSuccess = (response) => {
    console.log('Login Success:', response.profileObj);
    setUser(response.profileObj);
  };

  const handleLoginFailure = (response) => {
    console.error('Login Failed:', response);
  };

  const saveArticle = (article) => {
    setSavedArticles(prev => [...prev, article]);
  };

  const saveArticleToLocal = (article) => {
    const savedNews = JSON.parse(localStorage.getItem('savedArticles')) || [];
    savedNews.push(article);
    localStorage.setItem('savedArticles', JSON.stringify(savedNews));
  };

  return (
    <div className="container">
      
      {articles.length > 0 ? (
        <>
        <div className="header">
        <select value={category} onChange={handleCategoryChange}>
          <option value="general">General</option>
          <option value="business">Business</option>
          <option value="technology">Technology</option>
          <option value="entertainment">Entertainment</option>
          <option value="health">Health</option>
          <option value="science">Science</option>
          <option value="sports">Sports</option>
        </select>
        <input type="text" value={filter} onChange={handleFilterChange} placeholder="Filter news by keyword" />
        <select value={sort} onChange={handleSortChange}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
        {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <img src={user.imageUrl} alt="user" />
        </div>
        ) : (
        <GoogleLogin
          clientId="19307093645-4lgs2ob36hso7n1qp6doaqpvd3kcevgo.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy={'single_host_origin'}
        />
        )}
        </div>
        {sortedArticles.map(article => (
          <div className="news-item" key={article.url}>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <img src={article.urlToImage} alt={article.title} />
            <button onClick={() => {saveArticle(article); saveArticleToLocal(article); }}>Save</button>
          </div>
        ))}
        {savedArticles.length > 0 && (
          <div className="saved-news">
            <h3>Saved News</h3>
            {savedArticles.map((article, index) => (
              <div key={index}>
                <h4>{article.title}</h4>
                <p>{article.description}</p>
              </div>
            ))}
          </div>
        )}
    </>
    ) : (
      <p>No articles found.</p>
    )}
    </div>
    
  );  
}

export default App;

