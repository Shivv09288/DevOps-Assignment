import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

export default function Home() {
  const [message, setMessage] = useState('Loading...');
  const [status, setStatus] = useState('Connecting...');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://backend:5000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('API URL:', apiUrl);
        console.log('Attempting to connect to backend...');
        
        // First check if backend is healthy
        const healthCheck = await axios.get(`${apiUrl}/api/health`, { timeout: 5000 });
        console.log('Health check response:', healthCheck.data);
        
        if (healthCheck.data.status === 'healthy') {
          setStatus('Backend is connected!');
          // Then fetch the message
          const response = await axios.get(`${apiUrl}/api/message`, { timeout: 5000 });
          console.log('Message response:', response.data);
          setMessage(response.data.message);
        }
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          config: error.config?.url,
          status: error.response?.status,
          data: error.response?.data
        });
        setMessage('Failed to connect to the backend');
        setStatus(`Backend connection failed: ${error.message}`);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <div className="container">
      <Head>
        <title>DevOps Assignment</title>
        <meta name="description" content="DevOps Assignment with FastAPI and Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>DevOps Assignment</h1>
        <div className="status">
          <p>Status: <span className={status.includes('connected') ? 'success' : 'error'}>{status}</span></p>
        </div>
        <div className="message-box">
          <h2>Backend Message:</h2>
          <p>{message}</p>
        </div>
        <div className="info">
          <p>Backend URL: {apiUrl}</p>
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        h1 {
          margin: 0;
          line-height: 1.15;
          font-size: 3rem;
          margin-bottom: 2rem;
        }

        .message-box {
          margin: 2rem 0;
          padding: 1.5rem;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          width: 100%;
          max-width: 600px;
        }

        .success {
          color: #0070f3;
          font-weight: bold;
        }

        .error {
          color: #f00;
          font-weight: bold;
        }

        .info {
          margin-top: 2rem;
          font-size: 0.9rem;
          color: #666;
        }
      `}</style>
    </div>
  );
}
