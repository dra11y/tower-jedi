[{
    "name": "${app_name}",
    "image": "${image_name}",
    "essential": true,
    "cpu": ${fargate_cpu},
    "memory": ${fargate_memory},
    "networkMode": "awsvpc",
    "links": [],
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
            "awslogs-group": "/ecs/${app_name}",
            "awslogs-region": "${aws_region}",
            "awslogs-stream-prefix": "ecs"
        }
    },
    "portMappings": [{
        "containerPort": ${app_port},
        "hostPort": 80,
        "protocol": "tcp"
    }],
    "workingDirectory": "/app",
    "entryPoint": ["/app/entrypoint.sh"],
    "command": [],
    "environment": [],
    "mountPoints": [],
    "volumesFrom": []
}]
