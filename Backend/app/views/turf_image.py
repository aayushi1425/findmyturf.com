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
