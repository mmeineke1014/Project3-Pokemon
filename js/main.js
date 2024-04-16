

// // Variable to store the selected value
// var selectedColorByValue = "Default"; // Initialize with default value
// let bargraph, timeline;



// d3.csv('data/ufo_subset.csv')
// .then(data => {
//     console.log(data[0]);
//     console.log(data.length);
//     data.forEach(d => {
//       //console.log(d);
//       d.datetime = d.date_time
//       //process datetime into javascript date object
//       d.dateobject = new Date(d.date_time);
      
//       // Check if latitude and longitude are null, if so, set them to 0
//       d.latitude = !isNaN(d.latitude) ? +d.latitude : 0; //make sure these are not strings
//       d.longitude = !isNaN(d.longitude) ? +d.longitude : 0; //make sure these are not strings
//       d.city = d.city_area;
//       d.country = d.country;
//       d.described_encounter_length = d.described_encounter_length;
//       d.description = d.description;
//       d.shape = d.ufo_shape;
//       d.datedocumented = d.date_documented;
//       d.encounter_length = +d.encounter_length;
      
//       //calculate and assign time of day to datapoint
//       const hour = d.dateobject.getHours();

//       // Determine time of day based on hour
//       // time of day options
//       // Morning: Morning: 4:01am - 10am
//       // Afternoon: 10:01am - 4pm 
//       // Evening: 4:01pm - 10pm
//       // Night: 10:01pm - 4am
//       if (hour >= 4 && hour < 10) {
//         d.timeofday = 'Morning';
//       } else if (hour >= 10 && hour < 16) {
//         d.timeofday = 'Afternoon';
//       } else if (hour >= 16 && hour < 22) {
//         d.timeofday = 'Evening';
//       } else {
//         d.timeofday = 'Night';
//       }

//       //get the month in string form
//       d.month = d.dateobject.toLocaleString('en-US', {month: 'long'});

//     });

//     // Initialize chart and then show it
//     // maybe need new properties for settings? Need to figure out how we want to handle setting change logic
//     leafletMap = new LeafletMap({ parentElement: '#my-map'}, data);


    

//     //INITIAL MAP RENDERS

//     //NEED FUNCTION TO RENDER NEW MAPS WHEN SETTINGS CHANGE
//     //NEED TO ACCOUNT FOR SETTINGS 
//     //COLOR BY DROPDOWN: Options 1) year, 2) month, 3) time of day 
//     //time of day options
//     // morning: Morning: 4:01am - 10am
//     // Afternoon: 10:01am - 4pm 
//     // Evening: 4:01pm - 10pm
//     // night: 10:01pm - 4am
//     // (End values inclusive)

//     //get Timeline width and height:
//     timeline_height = document.getElementById("timeline_div").clientHeight;
//     timeline_width = document.getElementById("timeline_div").clientWidth;

//     //get Bargraph width and height:
//     bargraph_height = document.getElementById("b_vis_div").clientHeight;
//     bargraph_width = document.getElementById("b_vis_div").clientWidth;

//     timeline = new Timeline({
//       'parentElement': '#timeline',
//       'containerWidth': timeline_width,
//       'containerHeight': timeline_height
//     }, data);

//     bargraph = new Bargraph({
//       'parentElement': '#extra-vis',
//       'containerWidth': bargraph_width,
//       'containerHeight': bargraph_height - 50
//     }, data, "timeofday")
    
//   })
//   .catch(error => console.error(error));

// // Add an event listener to the settings button using D3
// d3.select("#detailSettingsButton").on("click", function() {
//     // Show the modal when the button is clicked
//     document.getElementById("myModal").style.display = "block";

//     // Clear old modal content
//     var modalContent = d3.select("#myModal .modal-content");
    
//     // Remove existing dropdown and label, if any
//     modalContent.selectAll("#colorByDropdown, label[for='colorByDropdown']").remove();

//     // Append label
//     modalContent.append("label")
//       .attr("for", "colorByDropdown")
//       .text("Color by: ");

//     // Append dropdown
//     var dropdown = modalContent.append("select")
//       .attr("id", "colorByDropdown")
//       .on("change", function() {
//         // Get selected value when dropdown value changes
//         selectedColorByValue = d3.select(this).property("value");
//         // Handle the selected value as needed
//         console.log("Selected value:", selectedColorByValue);
//         // Call the updateColorBy function with the selected value
//         leafletMap.updateColorBy(selectedColorByValue);
//       });

//     // Update dropdown options
//     updateDropdownOptions();
//   });

  
// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   document.getElementById("myModal").style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   var modal = document.getElementById("myModal");
//   if (event.target == modal) {
//       modal.style.display = "none";
//   }
// }

// // Function to update the dropdown options
// function updateDropdownOptions() {
//   // Clear existing dropdown options before adding new ones
//   var dropdown = d3.select("#colorByDropdown");
//   dropdown.selectAll("option").remove();

//   // Add options to the dropdown
//   var options = ["Default", "Year", "Month", "Time of day", "UFO Shape"];
//   dropdown.selectAll("option")
//     .data(options)
//     .enter().append("option")
//     .attr("value", d => d)
//     .text(d => d);

//   // Set the dropdown value to the previously selected value
//   dropdown.property("value", selectedColorByValue);
// }


// //Add event listeners to resize the Timeline and Bargraph:
// addEventListener("resize", resizeVisualizations);
// /*
// document.getElementById("month_button").addEventListener("click", onButtonClick("month"));
// document.getElementById("hour_button").addEventListener("click", onButtonClick("timeofday"));
// document.getElementById("shape_button").addEventListener("click", onButtonClick("ufo_shape"));
// document.getElementById("len_button").addEventListener("click", onButtonClick("encounter_length"));
// */

// document.getElementById("month_button").onclick = () => {
//   console.log("month button pressed");
//   bargraph.category = "month";
//   bargraph.updateVis();
// }

// document.getElementById("hour_button").onclick = () => {
//   console.log("hour button pressed");
//   bargraph.category = "timeofday";
//   bargraph.updateVis();
// }

// document.getElementById("shape_button").onclick = () => {
//   console.log("shape button pressed");
//   bargraph.category = "ufo_shape";
//   bargraph.updateVis();
// }

// document.getElementById("len_button").onclick = () => {
//   console.log("encounter length button pressed");
//   bargraph.category = "encounter_length";
//   bargraph.updateVis();
// }

// function resizeVisualizations() {
//   console.log('resize event triggered');

//   //get the new height and width of the timeline div
//   timeline.config.containerHeight = document.getElementById("timeline_div").clientHeight;
//   timeline.config.containerWidth = document.getElementById("timeline_div").clientWidth;

//   //call the update function
//   timeline.updateVis();
  
//   //get the new height and width for the B goal div
//   bargraph.config.containerHeight = document.getElementById("b_vis_div").clientHeight - 50;
//   bargraph.config.containerWidth = document.getElementById("b_vis_div").clientWidth;

//   //call the update function
//   bargraph.updateVis();
// }

// function onButtonClick(new_category){
//   console.log("category changed to", new_category)
//   if(bargraph){
//     bargraph.category = new_category;
//     bargraph.updateVis();
//   }
//   else{
//     console.log("CHECKPOINT");
//   }
// }

