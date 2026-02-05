from django.db import transaction
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from app.models.turf import Turf
from app.models.turf_image import TurfImage
from app.serializers.turf_image import TurfImageSerializer
from app.permission import IsOwner


class TurfImageUploadView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request, turf_id):
        try:
            turf = Turf.objects.select_related("business__user").get(
                id=turf_id, business__user=request.user
            )
        except Turf.DoesNotExist:
            return Response({"error": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        request.data["turf"] = turf_id
        serializer = TurfImageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(serializer.validated_data, dict) or "image" not in serializer.validated_data:
            return Response({"error": "Image field is required."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            is_first_image = not TurfImage.objects.filter(turf=turf).exists()

            image = TurfImage.objects.create(
                turf=turf,
                image=serializer.validated_data["image"],
                is_default=is_first_image,
            )

        return Response(
            TurfImageSerializer(image).data,
            status=status.HTTP_201_CREATED,
        )


class SetDefaultTurfImageView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request, image_id):
        try:
            image = TurfImage.objects.select_related("turf__business__user").get(
                id=image_id
            )
        except TurfImage.DoesNotExist:
            return Response({"error": "Image not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if image.turf.business.user != request.user:
            return Response({"error": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN,
            )

        with transaction.atomic():
            TurfImage.objects.filter(
                turf=image.turf,
                is_default=True,
            ).update(is_default=False)

            image.is_default = True
            image.save(update_fields=["is_default"])

        return Response({"message": "Default image updated"},
            status=status.HTTP_200_OK,
        )


class DeleteTurfImageView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def delete(self, request, image_id):
        try:
            image = TurfImage.objects.select_related("turf__business__user").get(
                id=image_id
            )
        except TurfImage.DoesNotExist:
            return Response({"error": "Image not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if image.turf.business.user != request.user:
            return Response({"error": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN,
            )

        turf = image.turf
        was_default = image.is_default

        image.delete()

        if was_default:
            next_image = (
                TurfImage.objects.filter(turf=turf).order_by("created_at").first()
            )

            if next_image:
                next_image.is_default = True
                next_image.save(update_fields=["is_default"])

        return Response({"message": "Image deleted"},
            status=status.HTTP_200_OK,
        )