pipeline {
    agent any
    environment {
        REGISTRY = 'your-docker-registry' // e.g. docker.io/yourusername
        BACKEND_IMAGE = "${REGISTRY}/backend:latest"
        FRONTEND_IMAGE = "${REGISTRY}/frontend:latest"
    }
    stages {
        stage('Checkout') {
            steps {
                // Checkout code from Git
                checkout scm
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
                    dir('src') {
                        sh 'docker build -t $FRONTEND_IMAGE .'
                    }
                }
            }
        }
        stage('Push Images') {
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
