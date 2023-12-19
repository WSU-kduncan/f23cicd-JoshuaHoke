# Part 1 - Semantic Versioning  

### Documentation  

- CD Project Overview
  - (what are you doing, why, what tools?)  
    I used WSL2 Ubuntu along with Git, GitHub (Actions (Workflows)), Docker, DockerHub, and Webhook in order to create a basic   
    CI/CD (Continuous Integration/Continuous Deployment) pipeline which, after I've used Git to commit code changes 
    and assigned a Semantic Versioning tag to particular commits (the last commit made, by default), and then pushed the tagged commit over to GitHub, enables 
    GitHub to automatically push a new, tagged, semantically versioned image over to DockerHub. DockerHub in turn works with Webhook 
    to set up a hook that runs a redeploy script for my Royal Bonsai Society website on my AWS instance, allowing the newest stable version of the 
    website to be instantly available to the teeming masses of fans and enthusiasts, just dripping with Bonsai goodness.  
- How to generate a `tag` in `git` / GitHub:   
  All you have to do is simply use a command like `git tag -a v3.0.0`. This will by default tag the last commit made. Next, push it on over to GitHubville 
  with a command of this nature: `git push origin v3.0.0`. Now the tagged commit is on Github and can be utilized or rolled back to. 
- Behavior of GitHub workflow
  - what does it do and when? 
    - A workflow is a configurable automated process that will run one or more jobs
    - Workflow is written in `YAML` files located in `.github/workflows`
    - will run when triggered by an event in your repository, or they can be triggered manually, or at a defined schedule
    - multiple workflows can exist in a repository
  - For example here are the contents of a workflow file I made called `main.yml`: 
 
    		```
		name: ci
		  on:
  		    push:
    		      tags:
      		        - 'v*.*.*'      
		jobs:
  		  build:
    		    runs-on: ubuntu-latest
    	              steps:
      		- 
                    name: Checkout
        		uses: actions/checkout@v4
      		- 
        		name: Get Docker Metadata
        		id: docker_metadata
        		uses: docker/metadata-action@v3
        		with:
          		images: '${{ secrets.DOCKERHUB_USERNAME }}/clockbox'
          		tags: |
            		type=ref,event=branch
            		type=ref,event=pr
            		type=semver,pattern={{version}}
            		type=semver,pattern={{major}}.{{minor}}
            		type=semver,pattern={{major}}
      		- 
        		name: Login to Docker Hub
        		uses: docker/login-action@v3
        		with:
          		username: ${{ secrets.DOCKERHUB_USERNAME }}
          		password: ${{ secrets.DOCKERHUB_PASSWORD }}
      		- name: Set up QEMU
        		uses: docker/setup-qemu-action@v3
      		- name: Set up Docker Buildx
        		uses: docker/setup-buildx-action@v3
      		- name: Build and push
        		uses: docker/build-push-action@v5
        		with:
          		context: .
          		file: ./Dockerfile
          		push: true
          		tags: |
            		${{ steps.docker_metadata.outputs.tags }}
            		${{ steps.docker_metadata.outputs.tags }}-latest
```
  - In this workflow file 
    - `name` is the name of the workflow and will be visible in GitHub Actions. 
    ```

on:
  push:
    tags:
      - 'v*.*.*'
```
    - specifies that the workflow will run whenever tags are pushed to the code repo and checks for semantic versioning. 
    - If you read through the rest of the workflow file you can begin to understand how it goes on to define a list 
   of `jobs` (this workflow only has one job, named `build`). Each `job` has its very own server/runner that it `runs-on`, 
   and you can see that `build` `runs-on` a latest stable Ubuntu runner. Each job consists of a series of (named) steps, which are either commands
   (designated wit `run`or fancy pre-fabricated actions (designated by `uses`. This workflow only has six actions, the first of which basically clones 
   the repo into the runner, the second of which extracts metadata from Git reference and GitHub events, the third of which logs into Dockerhub, 
   the fourth installs QEMU static binaries, the fifth creates and boots a builder that can be used in the following steps of 
   your workflow if you’re using Buildx or the build-push action, and finally the sixth step builds and pushes Docker images 
   with Buildx with full support of the features provided by Moby BuildKit builder toolkit. The code block at the bottom 
   sets the build context to the current directory, specifies the location of the Dockerfile to be used for building the Docker image, 
   and indicates that the action should push the Docker image to the specified registry after building it. Finally, at the very end 
   is a multi-line string block where Docker image tags are specified (the last line is actually unnecessary, it turns out).
- Link to Docker Hub repository (as additional proof): 
	- [DockerHub repo](https://hub.docker.com/repository/docker/jjh0k3/clockbox/general)

## Part 2 - Deployment 

### Documentation 

- How to install Docker to your instance: 
  I installed Docker with the following series of individually entered commands: 
    - `sudo apt-get update` 
    - `sudo apt-get upgrade` 
    - `sudo apt-get install ca-certificates curl gnupg`
    - `sudo install -m 0755 -d /etc/apt/keyrings`
    - `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg` 
    - `sudo chmod a+r /etc/apt/keyrings/docker.gpg` 
    - `echo   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \` 
    - `$(. /etc/os-release && echo "$VERSION_CODENAME") stable" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null` 
    - `sudo apt-get update` 
    - `sudo apt-get upgrade` 
    - `sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin` 
    - `sudo docker run hello-world` (to verify) 
- Container restart script
  - Justification & description of what it does: 
    - It's called `pull-restart.sh` and it's an executable bash script file. The justification and 
   description are pretty sel-evident from reading the file contents: 

		 ```
				#!/bin/bash
				# kill & remove the container
				docker kill webapp
				docker remove webapp
				# once dead and removed, the image it references can be removed
				docker image rm jjh0k3/clockbox:latest
				docker run -d -p 80:80 --name webapp --restart unless-stopped jjh0k3/clockbox:latest 

``` 

    - You can see that it is removing an old image and re-running a new image for the same app. It is necessary that the old one be removed 
in order to unbind the ports and clear the way for the new image. 

  - Where it should be on the instance (if someone were to use your setup): 
It should be in plain sight in the home directory of the instance. 
- Setting up a `webhook` on the instance
  - How to install [adnanh's `webhook`](https://github.com/adnanh/webhook) to the instance: 
    - adnanh says `If you are using Ubuntu linux (17.04 or later), you can install webhook using sudo apt-get install webhook which will install community packaged version.` So that is what I did. 
  - How to start the `webhook: 
    - since our instance's reboot, we need to handle this 
    - So you should initially use `sudo systemctl restart webhook, and there is also the `sudo systemctl start webhook` command. 
- `webhook` task definition file: 
  - This is called `hooks.json` in this project. 
  - Description of what it does: 
    - These are its contents: 

		``` 
				[
  				  {
    				    "id": "redeploy-webhook",
    				    "execute-command": "/home/ubuntu/pull-restart.sh"
                                  }
                                ] 

```






  - Where it should be on the instance (if someone were to use your setup)
