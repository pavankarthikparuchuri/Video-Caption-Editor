import './App.css';
import React from 'react';
import VideoCaptionEditor from './videoCaptionEditor';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title">Video Caption Editor</h1>
      </header>
      <main className="main-content">
        <VideoCaptionEditor />
      </main>
      <footer className="footer">
        Developed by Paruchuri Pavankarthik
      </footer>
    </div>
  );
}

export default App;
