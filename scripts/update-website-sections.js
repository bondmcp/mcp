/**
 * Script to update website sections with API endpoint information
 * This script reads the OpenAPI spec and generates HTML sections for the website
 */

const fs = require('fs');
const path = require('path');

// Function to read the OpenAPI spec
function readOpenAPISpec() {
  try {
    const openApiPath = path.join(__dirname, '..', 'spec', 'openapi.json');
    const openApiContent = fs.readFileSync(openApiPath, 'utf8');
    return JSON.parse(openApiContent);
  } catch (error) {
    console.error('Error reading OpenAPI spec:', error);
    return null;
  }
}

// Function to generate endpoints HTML section
function generateEndpointsSection(openApiSpec) {
  if (!openApiSpec || !openApiSpec.paths) {
    return '<p>No API endpoints available.</p>';
  }

  const paths = openApiSpec.paths;
  const pathKeys = Object.keys(paths).sort();
  
  let html = `
<section id="endpoints" class="py-12 bg-gray-50">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">API Endpoints</h2>
    <p class="text-center mb-8 max-w-3xl mx-auto">
      BondMCP provides a comprehensive set of API endpoints for healthcare AI applications.
      Below is a list of our available endpoints with documentation links.
    </p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
`;

  // Count endpoints by category
  const categories = {};
  let totalEndpoints = 0;
  
  pathKeys.forEach(path => {
    const methods = Object.keys(paths[path]);
    methods.forEach(method => {
      totalEndpoints++;
      const endpoint = paths[path][method];
      const tag = endpoint.tags && endpoint.tags.length > 0 ? endpoint.tags[0] : 'Other';
      
      if (!categories[tag]) {
        categories[tag] = 0;
      }
      categories[tag]++;
    });
  });

  // Generate category cards
  Object.keys(categories).sort().forEach(category => {
    html += `
      <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-semibold mb-3">${category}</h3>
        <p class="text-gray-600 mb-4">${categories[category]} endpoint${categories[category] > 1 ? 's' : ''}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">API v${openApiSpec.info.version || '1.0.0'}</span>
          <a href="https://docs.bondmcp.com/endpoints#${category.toLowerCase().replace(/\s+/g, '-')}" 
             class="text-blue-600 hover:text-blue-800 font-medium">
            View Documentation →
          </a>
        </div>
      </div>
    `;
  });

  html += `
    </div>
    
    <div class="mt-12 text-center">
      <p class="mb-6">Explore our complete API documentation:</p>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="https://docs.bondmcp.com" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
          Documentation
        </a>
        <a href="https://swagger.bondmcp.com" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors">
          Swagger UI
        </a>
        <a href="https://postman.bondmcp.com" class="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-md transition-colors">
          Postman Collection
        </a>
        <a href="https://openapi.bondmcp.com/openapi.json" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors">
          OpenAPI Spec
        </a>
      </div>
    </div>
  </div>
</section>
`;

  return html;
}

// Function to generate contact section with proper company information
function generateContactSection() {
  return `
<section id="contact" class="py-12 bg-white">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">Contact Us</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div class="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">US Office</h3>
        <address class="not-italic">
          <p class="mb-2">111 NE 1st St, STE 89079</p>
          <p class="mb-2">33132, Miami, Florida</p>
          <p class="mb-4">United States</p>
          <p class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <a href="tel:+18555125310" class="hover:text-blue-600">+1 855 512 5310</a>
          </p>
        </address>
      </div>
      
      <div class="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">Hong Kong Office</h3>
        <address class="not-italic">
          <p class="mb-2">144-151 Connaught Road West</p>
          <p class="mb-2">Unit 4005, 40/F</p>
          <p class="mb-4">Sai Ying Pun, Hong Kong</p>
          <p class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href="mailto:support@bondmcp.com" class="hover:text-blue-600">support@bondmcp.com</a>
          </p>
        </address>
      </div>
    </div>
    
    <div class="mt-12 max-w-4xl mx-auto text-center">
      <p class="text-gray-600">
        For technical support, please visit our <a href="https://docs.bondmcp.com" class="text-blue-600 hover:underline">documentation</a> 
        or contact our support team at <a href="mailto:support@bondmcp.com" class="text-blue-600 hover:underline">support@bondmcp.com</a>.
      </p>
    </div>
  </div>
</section>
`;
}

// Function to generate footer section with proper company information
function generateFooterSection() {
  const currentYear = new Date().getFullYear();
  
  return `
<footer class="bg-gray-800 text-white py-12">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <h3 class="text-xl font-semibold mb-4">BondMCP</h3>
        <p class="text-gray-300 mb-4">
          Medical Context Protocol for healthcare AI applications.
        </p>
        <p class="text-gray-400 text-sm">
          © ${currentYear} Lifecycle Innovations Limited
        </p>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold mb-4">Resources</h3>
        <ul class="space-y-2">
          <li><a href="https://docs.bondmcp.com" class="text-gray-300 hover:text-white">Documentation</a></li>
          <li><a href="https://swagger.bondmcp.com" class="text-gray-300 hover:text-white">API Reference</a></li>
          <li><a href="https://github.com/bondmcp/mcp" class="text-gray-300 hover:text-white">GitHub</a></li>
          <li><a href="https://docs.bondmcp.com/changelog" class="text-gray-300 hover:text-white">Changelog</a></li>
        </ul>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold mb-4">Company</h3>
        <ul class="space-y-2">
          <li><a href="/about" class="text-gray-300 hover:text-white">About Us</a></li>
          <li><a href="/contact" class="text-gray-300 hover:text-white">Contact</a></li>
          <li><a href="/privacy" class="text-gray-300 hover:text-white">Privacy Policy</a></li>
          <li><a href="/terms" class="text-gray-300 hover:text-white">Terms of Service</a></li>
        </ul>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold mb-4">Connect</h3>
        <ul class="space-y-2">
          <li><a href="https://twitter.com/bondmcp" class="text-gray-300 hover:text-white">Twitter</a></li>
          <li><a href="https://linkedin.com/company/bondmcp" class="text-gray-300 hover:text-white">LinkedIn</a></li>
          <li><a href="mailto:support@bondmcp.com" class="text-gray-300 hover:text-white">Email</a></li>
        </ul>
      </div>
    </div>
    
    <div class="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-400">
      <p>
        BondMCP is a brand of Lifecycle Innovations Limited. All rights reserved.
      </p>
      <p class="mt-2">
        US Office: 111 NE 1st St, STE 89079, 33132, Miami, Florida | 
        Hong Kong Office: 144-151 Connaught Road West, Unit 4005, 40/F, Sai Ying Pun
      </p>
    </div>
  </div>
</footer>
`;
}

// Main function to update all website sections
function updateWebsiteSections() {
  try {
    console.log('Updating website sections...');
    
    // Read OpenAPI spec
    const openApiSpec = readOpenAPISpec();
    if (!openApiSpec) {
      console.error('Failed to read OpenAPI spec, cannot update website sections');
      process.exit(1);
    }
    
    // Generate sections
    const endpointsSection = generateEndpointsSection(openApiSpec);
    const contactSection = generateContactSection();
    const footerSection = generateFooterSection();
    
    // Write sections to files
    fs.writeFileSync(path.join(__dirname, '..', 'website-endpoints-section.html'), endpointsSection);
    fs.writeFileSync(path.join(__dirname, '..', 'website-contact-section.html'), contactSection);
    fs.writeFileSync(path.join(__dirname, '..', 'website-footer-section.html'), footerSection);
    
    console.log('Website sections updated successfully');
  } catch (error) {
    console.error('Error updating website sections:', error);
    process.exit(1);
  }
}

// Execute the main function
updateWebsiteSections();
