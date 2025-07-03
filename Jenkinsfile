pipeline {
    agent any

    environment {
        REGISTRY = 'nithi1230' // 
        IMAGE_TAG = "${BUILD_NUMBER}"
        BACKEND_IMAGE = "${REGISTRY}/ksp_backend:${IMAGE_TAG}"
        FRONTEND_IMAGE = "${REGISTRY}/ksp_src:${IMAGE_TAG}"
    }

    stages {
        
        stage('Checkout') {
            steps {
                git url: 'https://github.com/Nithish-ponnusamy/ksp_user_devops.git', branch: 'main'
                // If private repo, add: credentialsId: 'your-git-credentials-id'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                script {
                    dir('backend') {
                        sh 'docker build -t $BACKEND_IMAGE .'
                    }
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                script {
                    dir('frontend') {
                        sh 'docker build -t $FRONTEND_IMAGE .'
                    }
                }
            }
        }

        stage('Push Images to Registry') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login $REGISTRY -u $DOCKER_USER --password-stdin'
                    sh 'docker push $BACKEND_IMAGE'
                    sh 'docker push $FRONTEND_IMAGE'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh 'kubectl apply -f deployment/backend.yaml'
                    sh 'kubectl apply -f deployment/src.yaml'
                }
            }
        }
    }
}
