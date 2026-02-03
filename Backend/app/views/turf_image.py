from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from app.models.turf import Turf
from app.models.turf_image import TurfImage
from app.serializers.turf_image import TurfImageSerializer
from app.permission import IsOwner


class TurfImageUploadView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request, turf_id):
        turf = Turf.objects.get(id=turf_id, business__user=request.user)

        serializer = TurfImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        is_first = not TurfImage.objects.filter(turf=turf).exists()

        image = serializer.save(turf=turf, is_default=is_first)
        print(image.image.url)
        return Response(TurfImageSerializer(image).data, status=status.HTTP_201_CREATED)

class SetDefaultTurfImageView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request, image_id):
        image = TurfImage.objects.get(id=image_id)

        if image.turf.business.user != request.user:
            return Response(status=403)
        
        TurfImage.objects.filter(turf=image.turf, is_default=True).update(
            is_default=False
        )
        image.is_default = True
        image.save()

        return Response({"msg": "Default image updated"})

class DeleteTurfImageView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def delete(self, request, image_id):
        image = TurfImage.objects.get(id=image_id)

        if image.turf.business.user != request.user:
            return Response(status=403)

        image.delete()

        return Response({"msg": "Image deleted"})

class TurfImageUploadView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request, turf_id):
        try:
            turf = Turf.objects.get(
                id=turf_id,
                business__user=request.user
            )
        except Turf.DoesNotExist:
            return Response(
                {"error": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = TurfImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

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
class TurfImageUploadView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request, turf_id):
        try:
            turf = Turf.objects.get(
                id=turf_id,
                business__user=request.user
            )
        except Turf.DoesNotExist:
            return Response(
                {"error": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = TurfImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

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
    
    
class DeleteTurfImageView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def delete(self, request, image_id):
        try:
            image = TurfImage.objects.select_related(
                "turf__business__user"
            ).get(id=image_id)
        except TurfImage.DoesNotExist:
            return Response(
                {"error": "Image not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if image.turf.business.user != request.user:
            return Response(
                {"error": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN,
            )

        was_default = image.is_default
        turf = image.turf

        image.delete()

        # Ensure turf always has a default image
        if was_default:
            next_image = TurfImage.objects.filter(turf=turf).first()
            if next_image:
                next_image.is_default = True
                next_image.save(update_fields=["is_default"])

        return Response(
            {"message": "Image deleted"},
            status=status.HTTP_200_OK,
        )
