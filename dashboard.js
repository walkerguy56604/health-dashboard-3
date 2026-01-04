<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Health Dashboard</title>
<style>
  body { font-family: sans-serif; margin: 20px; }
  select { margin-right: 10px; padding: 5px; }
  .category { font-weight: bold; margin-top: 15px; }
  p { margin: 4px 0; }
</style>
</head>
<body>

<h1>Health Dashboard</h1>

<!-- Controls -->
<label for="datePicker">Select Date:</label>
<select id="datePicker"></select>

<label for="bpFilter">BP Filter:</label>
<select id="bpFilter">
  <option value="all">All</option>
  <option value="L">Low</option>
  <option value="M">Medium</option>
  <option value="H">High</option>
</select>

<!-- Output -->
<div id="dailySummaryOutput" style="margin-top:20px;"></div>

<!-- Scripts -->
<script type="module" src="dashboard.js"></script>

</body>
</html>
