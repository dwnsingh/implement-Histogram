/*
  program is divided into four segments
  1. first segments is responsible for drawing post_word_count histogram
  2. second segments is responsible for drawing pages_word_count histogram
  3. third segments is responsible for redrawing histograms for custom user inputs
  4. fourth segment is to ensure everything load and execute after a button is clicked
*/

// Segment 1 -----------------------------------------------------------------------------------

let posturl = 'https://www.vdocipher.com/blog/wp-json/wp/v2/posts?per_page=100';
let pageurl = 'https://www.vdocipher.com/blog/wp-json/wp/v2/pages?per_page=100'


let postarr = []      // array to store word count of every post
let postwordmap = {}    // object to store frequencies of different word range for post data
let pageArray = []    // array to store word count of every page
let pagewordmap = {}   // object to store frequencies of different word range for page data
let post_word_range = 500   //  word range for horizontal axis
let page_word_range = 100   // word range for horizontal axis


// function to load google chart library
function includeCharts(drawChart){
  google.charts.load('current', {packages: ['corechart']});
  google.charts.setOnLoadCallback(drawChart);
}

// function to map different word ranges to their frequencies
function createPostWordMap(range){
  for(let data of postarr){
    let index = Math.floor(data/range);

    if(index < 10){
      if(postwordmap[index] == null)
        postwordmap[index] = 1
      else
        postwordmap[index] +=1
    }
    else{
      if(postwordmap[10] == null)
        postwordmap[10] = 1
      else
        postwordmap[10] +=1
    }
    
  }
}

// this is the driving function. it fetch data from server then call all other functions
function getWordsPerPostFromServer(){
  $('#wordsinPost').text('calculating... post word count');
  $.get(posturl,function(response){
    for(let post of response){
      let wordData = post.content.rendered;
      let wordList = wordData.match(/\b[-?(\w+)?]+\b/gi);
      // let wordList = wordData.match(/\b[^\d\W]+\b/gi);
      try{
        postarr.push(wordList.length);
      }
      catch(e){console.log(e)}
      
    
    }
    createPostWordMap(post_word_range);
    includeCharts(drawChart_wordPerPost)
  })
}

// this function convert postwordmap object data into DataTable form and return it.
function getpostDataTable(range){
  let data = []
  data.push(['word range', 'Posts'])
  for(let dt in postwordmap){
    var lowerLimit = range*Number(dt);
    let upperLimit = range*(Number(dt)+1);
    data.push([lowerLimit+'-'+upperLimit , postwordmap[dt]])
  }
  data[data.length-1][0] = lowerLimit+'-'+'Infinity'
  return data;
}

// this function draw post histogram
function drawChart_wordPerPost() {
  let dd = getpostDataTable(post_word_range);
  var data = google.visualization.arrayToDataTable(dd);

  var options = {
    title: "post word count",
    width: 1200,
    height: 400,
    bar: {groupWidth: "60%"},
    legend: { position: "none" },
    
  };

  // Instantiate and draw the chart.
  var chart = new google.visualization.ColumnChart(document.getElementById('wordsPerPost'));
  chart.draw(data, options);
  // remove the calculating... message
  $('#wordsinPost').text('');
}




// Segment 2 -----------------------------------------------------------------------------------------

//function to map different word ranges to their frequencies for page data
function createPageWordMap(range){
  for(let data of pageArray){
    let index = Math.floor(data/range);

    if(index < 20){
      if(pagewordmap[index] == null)
        pagewordmap[index] = 1
      else
        pagewordmap[index] +=1
    }
    else{
      if(pagewordmap[20] == null)
        pagewordmap[20] = 1
      else
        pagewordmap[20] +=1
    }
    
  }
}

// driving function for page Data. it fetch data from server then call all other functions
function getWordsPerPageFromServer(){
  $('#wordsinPage').text('calculating... page word count');
  // console.log('yes...')
  $.get(pageurl,function(response){
    for(let post of response){
      let wordData = post.content.rendered;
      let wordList = wordData.match(/\b[-?(\w+)?]+\b/gi);
      // let wordList = wordData.match(/\b[^\d\W]+\b/gi);
      try{
        pageArray.push(wordList.length);
      }
      catch(e){console.log(e)}
      
    
    }
    createPageWordMap(page_word_range);
    includeCharts(drawChart_wordPerPage)
  })
}

// this function convert postwordmap object data into DataTable form and return it.
function getPageDataTable(range){
  let data = []
  data.push(['word range', 'Pages'])
  for(let dt in pagewordmap){
    var lowerLimit = range*Number(dt);
    let upperLimit = range*(Number(dt)+1);
    data.push([lowerLimit+'-'+upperLimit , pagewordmap[dt]])
  }
  data[data.length-1][0] = lowerLimit+'-'+'Infinity'
  return data;
}

// this function draw page histogram  
function drawChart_wordPerPage() {
  let dd = getPageDataTable(page_word_range);
  var data = google.visualization.arrayToDataTable(dd);

  var options = {
    title: "pages word count",
    width: 1200,
    height: 400,
    bar: {groupWidth: "60%"},
    legend: { position: "none" },
    
  };

  // Instantiate and draw the chart.
  var chart = new google.visualization.ColumnChart(document.getElementById('wordsPerPage'));
  chart.draw(data, options);
  $('#wordsinPage').text('');
}


// Segment 3 ---------------------------------------------------------------------------------------

$('#set_post_word_count').click(function(){
  let post_sample_size = $('#post_sample_size').val();
  posturl = 'https://www.vdocipher.com/blog/wp-json/wp/v2/posts?per_page='+post_sample_size;
  post_word_range = $('#post_range').val();
  postarr = []
  postwordmap = {}
  getWordsPerPostFromServer();
  
});

$('#set_page_word_count').click(function(){
  let page_sample_size = $('#page_sample_size').val();
  pageurl = 'https://www.vdocipher.com/blog/wp-json/wp/v2/pages?per_page='+page_sample_size;
  page_word_range = $('#page_range').val();
  pageArray = []
  pagewordmap = {}
  getWordsPerPageFromServer();
  
});

// Segment 4 ----------------------------------------------------------------------------------------

$('#confirmButtom').click(function(){
  $('#beforeButton').hide();
  $('#afterButton').show();
  getWordsPerPostFromServer();
  getWordsPerPageFromServer();
})