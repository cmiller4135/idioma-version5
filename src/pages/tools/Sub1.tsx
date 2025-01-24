import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import debounce from 'lodash.debounce';
import axios from 'axios';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Sub1 = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [conjugations, setConjugations] = useState('');
  const [examples, setExamples] = useState([]);

  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (query.length > 0) {
        const { data, error } = await supabase
          .from('conjugations')
          .select('spanish_verb')
          .ilike('spanish_verb', `%${query}%`);
        if (!error) {
          setSuggestions(data.map(item => item.spanish_verb));
          setShowSuggestions(true);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  const handleSuggestionClick = async (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);

    // Query OpenAI for conjugations and example sentences
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: `Provide the present indicative conjugations of the Spanish verb "${suggestion}" along with three example sentences using the verb.`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data.choices[0].message.content;
    const [conjugations, ...examples] = data.split('\n').filter(line => line.trim() !== '');
    setConjugations(conjugations);
    setExamples(examples);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveSuggestion((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestion((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      handleSuggestionClick(suggestions[activeSuggestion]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-[#E63946]">
      <h1>Spanish Verb Conjugator with Example sentences</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a Spanish verb..."
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="mt-2 border border-gray-300 rounded max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`p-2 cursor-pointer ${index === activeSuggestion ? 'bg-gray-200' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {conjugations && (
        <div className="mt-4">
          <h2>Conjugations</h2>
          <p>{conjugations}</p>
          <h2>Examples</h2>
          <ul>
            {examples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sub1;