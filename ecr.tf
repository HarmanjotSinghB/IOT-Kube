resource "aws_ecr_repository" "my_iot_app" {
  name = "my-iot-app" # Replace with your repository name

  # Optionally, you can configure encryption
  # encryption_configuration {
  #   encryption_type = "AES256"
  # }
}

# Optionally, create an ECR image policy (for example, to allow IAM users to push images)
# resource "aws_ecr_repository_policy" "my_iot_app_policy" {
#   name = "my-iot-app"
#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Effect = "Allow",
#         Principal = {
#           AWS = "arn:aws:iam::123456789012:user/my-user" # Replace with your IAM user ARN
#         },
#         Action = [
#           "ecr:GetDownloadUrlForLayer",
#           "ecr:BatchGetImage",
#           "ecr:BatchCheckLayerAvailability",
#           "ecr:PutImage",
#           "ecr:DeleteRepository",
#           "ecr:CreateRepository",
#           "ecr:DescribeRepositories",
#           "ecr:ListTagsForResource",
#           "ecr:TagResource",
#           "ecr:UntagResource"
#         ],
#         Resource = "arn:aws:ecr:us-east-1:123456789012:repository/my-iot-app" # Replace with your ECR repository ARN
#       }
#     ]
#   })
# }