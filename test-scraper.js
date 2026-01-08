/**
 * Test script to verify scrapers are working
 * Run: node test-scraper.js
 */

const { searchAllJobs } = require('./scrapers');

async function test() {
  console.log('🧪 Testing job scrapers...\n');
  
  const testQuery = 'developer';
  console.log(`📝 Test query: "${testQuery}"\n`);
  
  try {
    const jobs = await searchAllJobs(testQuery);
    
    console.log('\n' + '='.repeat(50));
    console.log(`✅ TEST COMPLETED`);
    console.log('='.repeat(50));
    console.log(`Total jobs found: ${jobs.length}`);
    
    if (jobs.length > 0) {
      console.log('\n📋 Sample results (first 3):');
      jobs.slice(0, 3).forEach((job, i) => {
        console.log(`\n${i + 1}. ${job.title}`);
        console.log(`   Company: ${job.company}`);
        console.log(`   Location: ${job.location}`);
        console.log(`   Source: ${job.source}`);
        console.log(`   Link: ${job.link}`);
        if (job.datePosted) {
          console.log(`   Posted: ${new Date(job.datePosted).toLocaleDateString()}`);
        }
      });
      
      // Group by source
      const bySource = jobs.reduce((acc, job) => {
        acc[job.source] = (acc[job.source] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\n📊 Jobs by source:');
      Object.entries(bySource).forEach(([source, count]) => {
        console.log(`   ${source}: ${count} jobs`);
      });
    } else {
      console.log('⚠️ No jobs found. This might be normal if:');
      console.log('   - Websites changed their structure');
      console.log('   - No jobs match the query');
      console.log('   - Network issues occurred');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run test
test().then(() => {
  console.log('\n✨ Test complete!');
  process.exit(0);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

