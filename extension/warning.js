// PhishGuard AI - Warning Page Script
// Handles user interactions on the warning/blocking page

let threatData = {
  url: '',
  score: 0,
  risk: 'high',
  reasons: [],
  confidence: 1.0
};

/**
 * Initialize warning page
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('PhishGuard warning page loaded');
  
  // Parse URL parameters
  const params = new URLSearchParams(window.location.search);
  
  threatData = {
    url: params.get('url') || 'Unknown URL',
    score: parseInt(params.get('score')) || 0,
    risk: params.get('risk') || 'high',
    reasons: JSON.parse(params.get('reasons') || '[]'),
    confidence: parseFloat(params.get('confidence')) || 1.0
  };
  
  console.log('Threat data:', threatData);
  
  // Update UI with threat data
  displayThreatData();
  
  // Setup event listeners
  setupEventListeners();
});

/**
 * Display threat data in UI
 */
function displayThreatData() {
  // Display threat score
  const scoreElement = document.getElementById('threatScore');
  if (scoreElement) {
    scoreElement.textContent = threatData.score;
    
    // Color code based on score
    if (threatData.score >= 80) {
      scoreElement.style.color = '#dc2626'; // Red
    } else if (threatData.score >= 60) {
      scoreElement.style.color = '#ea580c'; // Orange
    } else {
      scoreElement.style.color = '#ca8a04'; // Yellow
    }
  }
  
  // Display risk level
  const riskElement = document.getElementById('riskLevel');
  if (riskElement) {
    const riskLabels = {
      'critical': 'CRITICAL THREAT',
      'high': 'HIGH RISK',
      'medium': 'MEDIUM RISK',
      'low': 'LOW RISK'
    };
    riskElement.textContent = riskLabels[threatData.risk] || 'THREAT DETECTED';
  }
  
  // Display blocked URL
  const urlElement = document.getElementById('blockedUrl');
  if (urlElement) {
    urlElement.textContent = threatData.url;
  }
  
  // Display reasons
  displayReasons();
  
  // Display confidence
  displayConfidence();
}

/**
 * Display threat reasons
 */
function displayReasons() {
  const reasonsList = document.getElementById('reasonsList');
  if (!reasonsList) return;
  
  reasonsList.innerHTML = '';
  
  if (threatData.reasons.length === 0) {
    threatData.reasons = ['Suspicious URL patterns detected', 'Site flagged by threat intelligence'];
  }
  
  const icons = ['🚫', '⚠️', '🔴', '⛔', '❌'];
  
  threatData.reasons.forEach((reason, index) => {
    const li = document.createElement('li');
    li.className = 'reason-item';
    li.style.animationDelay = `${index * 0.1}s`;
    
    li.innerHTML = `
      <span class="reason-icon">${icons[index % icons.length]}</span>
      <span class="reason-text">${reason}</span>
    `;
    
    reasonsList.appendChild(li);
  });
}

/**
 * Display confidence meter
 */
function displayConfidence() {
  const confidencePercent = Math.round(threatData.confidence * 100);
  
  const percentElement = document.getElementById('confidencePercent');
  if (percentElement) {
    percentElement.textContent = confidencePercent;
  }
  
  const fillElement = document.getElementById('confidenceFill');
  if (fillElement) {
    setTimeout(() => {
      fillElement.style.width = `${confidencePercent}%`;
    }, 300);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Go Back button
  const goBackBtn = document.getElementById('goBackBtn');
  if (goBackBtn) {
    goBackBtn.addEventListener('click', () => {
      console.log('User chose to go back');
      window.history.back();
      
      // If history.back() doesn't work, redirect to safe page
      setTimeout(() => {
        window.location.href = 'https://www.google.com';
      }, 500);
    });
  }
  
  // Whitelist button (show confirmation first)
  const whitelistBtn = document.getElementById('whitelistBtn');
  const proceedConfirmation = document.getElementById('proceedConfirmation');
  
  if (whitelistBtn && proceedConfirmation) {
    whitelistBtn.addEventListener('click', () => {
      console.log('User wants to proceed - showing confirmation');
      proceedConfirmation.style.display = 'block';
      whitelistBtn.style.display = 'none';
    });
  }
  
  // Cancel proceed
  const cancelProceedBtn = document.getElementById('cancelProceedBtn');
  if (cancelProceedBtn && proceedConfirmation && whitelistBtn) {
    cancelProceedBtn.addEventListener('click', () => {
      proceedConfirmation.style.display = 'none';
      whitelistBtn.style.display = 'flex';
    });
  }
  
  // Confirm proceed (whitelist and navigate)
  const confirmProceedBtn = document.getElementById('confirmProceedBtn');
  if (confirmProceedBtn) {
    confirmProceedBtn.addEventListener('click', async () => {
      console.log('User confirmed proceeding to:', threatData.url);
      
      // Extract domain from URL
      try {
        const urlObj = new URL(threatData.url);
        const domain = urlObj.hostname;
        
        // Send message to background script to whitelist
        chrome.runtime.sendMessage({
          action: 'whitelistDomain',
          domain: domain
        }, (response) => {
          console.log('Whitelist response:', response);
          
          // Log the override
          chrome.runtime.sendMessage({
            action: 'proceedAnyway',
            url: threatData.url,
            score: threatData.score
          });
          
          // Navigate to the URL
          window.location.href = threatData.url;
        });
        
      } catch (error) {
        console.error('Error processing URL:', error);
        alert('Error processing URL. Please try again.');
      }
    });
  }
  
  // Report false positive
  const reportLink = document.getElementById('reportFalsePositive');
  if (reportLink) {
    reportLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Open feedback form or log report
      const confirmed = confirm(
        'Report this as a false positive?\n\n' +
        'This will help improve PhishGuard AI\'s accuracy. ' +
        'The site will be reviewed and potentially whitelisted.'
      );
      
      if (confirmed) {
        console.log('False positive reported for:', threatData.url);
        
        // TODO: Send to backend API for review
        chrome.runtime.sendMessage({
          action: 'reportFalsePositive',
          url: threatData.url,
          score: threatData.score
        });
        
        alert('Thank you! Your report has been submitted.');
      }
    });
  }
}

// Log page view for analytics
console.log('PhishGuard warning displayed for:', threatData.url);
