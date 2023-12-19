## Part 1 - Semantic Versioning  

### Documentation  

- CD Project Overview
  - (what are you doing, why, what tools)  
	- > I used WSL2 Ubuntu along with Git, GitHub (Actions (Workflows)), Docker, DockerHub, and Webhook in order to create a basic  

	   CI/CD (Continuous Integration/Continuous Deployment) pipeline which, after I've used Git to commit code changes 

           and assigned a Semantic Versioning tag to particular commits (the last commit made, by default), and then pushed the tagged commit over to GitHub,  

	   enables GitHub to automatically push a new, tagged, semantically versioned image over to DockerHub. DockerHub in turn works with  

           Webhook to set up a hook that runs a redeploy script for my Royal Bonsai Society website on my AWS instance, allowing the newest stable version of 

           of the website to be instantly available to the teeming masses of fans and enthusiasts, just dripping with Bonsai goodness.
