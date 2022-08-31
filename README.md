<h1 align="center">
  <br>
  <a href="https://vantage6.ai"><img src="https://github.com/IKNL/guidelines/blob/master/resources/logos/vantage6.png?raw=true" alt="vantage6" width="400"></a>
</h1>

<h3 align=center> A privacy preserving analysis solution</h3>

--------------------

# vantage6 demo
The repository contains all that is needed to setup a demo kit. It requires:

* 4 Raspberry pi's 4 with at least 4Gb of memory
* 4 Touch screens that work with the PI
* A bit of patience to get everything working
* External vantage6 server

The demo will show three nodes in which users can input some sensitive data.
For example, age and weight. The final screen is used as a researcher, it has
a single button to start the analysis. When the button is pressed the Multi
party computation (MPC) algorithm will compute the average of the three nodes.
Finally the results are displayed at the researcher station.

