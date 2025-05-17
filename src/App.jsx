// src/App.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Send, PlusCircle, Bot, User, RefreshCw } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [examples] = useState([
    "What were our total sales by product category last quarter?",
    "Compare customer retention rates between regions over the past 2 years.",
    "Which departments have the highest employee turnover and what's the trend?",
    "What is the correlation between marketing spend and revenue growth?",
    "Show me the profitability analysis of our top 5 customers."
  ]);

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:3000/api/query', { query: input });
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: response.data.answer, 
          sql: response.data.sql,
          data: response.data.data,
          chartType: response.data.chartType || 'bar',
          timestamp: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.error("Error querying the agent:", err);
      setError("Failed to get a response. Please try again.");
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I encountered an error processing your request. Please try rephrasing your question or check if the database is available.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (example) => {
    setInput(example);
  };

  const renderChart = (data, chartType) => {
    if (!data || data.length === 0) return null;
    
    const chartWidth = window.innerWidth < 768 ? window.innerWidth - 40 : 600;
    const chartHeight = 300;
    
    switch(chartType) {
      case 'bar':
        return (
          <BarChart width={chartWidth} height={chartHeight} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(data[0])
              .filter(key => key !== 'name')
              .map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
              ))}
          </BarChart>
        );
      
      case 'line':
        return (
          <LineChart width={chartWidth} height={chartHeight} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(data[0])
              .filter(key => key !== 'name')
              .map((key, index) => (
                <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} />
              ))}
          </LineChart>
        );
      
      case 'pie':
        return (
          <PieChart width={chartWidth} height={chartHeight}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      
      default:
        return (
          <BarChart width={chartWidth} height={chartHeight} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(data[0])
              .filter(key => key !== 'name')
              .map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
              ))}
          </BarChart>
        );
    }
  };

  const renderTable = (data) => {
    if (!data || data.length === 0) return null;
    
    const headers = Object.keys(data[0]);
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="py-2 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex} className="py-2 px-4 text-sm text-gray-700">
                    {row[header]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">AI Data Agent</h1>
        <p className="text-sm opacity-80">Ask complex analytical questions about your business data</p>
      </header>
      
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-indigo-600 mb-2">Welcome to AI Data Agent!</h2>
              <p className="text-gray-600 mb-4">
                I can answer complex analytical questions about your business data. Try asking me about sales, customers, 
                employees, or any other business metrics in the database.
              </p>
              <div className="text-sm text-gray-500">
                <p className="mb-1">Example questions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {examples.map((example, index) => (
                    <li key={index} className="hover:text-indigo-600 cursor-pointer" onClick={() => handleExampleClick(example)}>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3xl rounded-lg p-4 shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <span className="p-1 rounded-full mr-2 bg-opacity-20 bg-gray-200">
                      {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </span>
                    <span className="font-medium">
                      {message.role === 'user' ? 'You' : 'AI Agent'}
                    </span>
                    <span className="text-xs opacity-50 ml-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-700'}`}>
                    {message.content}
                  </div>
                  
                  {message.role === 'assistant' && message.sql && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <details className="text-xs">
                        <summary className="cursor-pointer font-medium text-indigo-600">View SQL Query</summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto text-gray-800">{message.sql}</pre>
                      </details>
                    </div>
                  )}
                  
                  {message.role === 'assistant' && message.data && (
                    <div className="mt-4">
                      {renderChart(message.data, message.chartType)}
                      <div className="mt-4">
                        {renderTable(message.data)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-3xl rounded-lg p-4 shadow-sm bg-white border border-gray-200">
                  <div className="flex items-center">
                    <RefreshCw size={16} className="animate-spin mr-2" />
                    <span className="text-gray-600 text-sm">Analyzing your question...</span>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="rounded-lg p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a complex analytical question..."
              className="flex-1 p-3 text-black rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;