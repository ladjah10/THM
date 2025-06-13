/**
 * Simple test script to verify recalculation system functionality
 */

async function testRecalculationAPI() {
  console.log('Testing recalculation API endpoint...');
  
  try {
    const response = await fetch('http://localhost:5000/api/admin/recalculate-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Recalculation API working successfully');
      console.log('Response:', JSON.stringify(result, null, 2));
    } else {
      console.error('❌ API request failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

testRecalculationAPI();