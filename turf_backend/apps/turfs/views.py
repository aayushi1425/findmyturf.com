import cloudinary.uploader
from django.shortcuts import get_object_or_404

from apps.business.models import BusinessUser
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny , IsAuthenticated
from .models import Turfs, TurfImage
from .serializers import TurfsSerializer, TurfImageSerializer


class TurfList(APIView):
    permission_classes = [AllowAny]

    def get(self , request):
        turfs = Turfs.objects.all()
        serializer = TurfsSerializer(turfs, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BusinessTurfs(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TurfsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(
            {"message": "Turf registered successfully", "data": serializer.data},
            status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request):
        user = request.user
        turfs = Turfs.objects.filter(owner = user)
        serializer = TurfsSerializer(turfs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        try:
            turf = Turfs.objects.get(pk=pk, owner=request.user)
        except Turfs.DoesNotExist:
            return Response({"detail": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TurfsSerializer(turf , data=request.data , partial = True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                    "message": "Turf updated successfully",
                    "data": serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            turf = Turfs.objects.get(pk = pk, owner = request.user)
        except Turfs.DoesNotExist:
            return Response({"detail": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        turf.delete()
        return Response({"message": "Turf deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    



class TurfImageListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, turf_id):
        turf = get_object_or_404(Turfs, id=turf_id)
        images = turf.images.all()
        serializer = TurfImageSerializer(images, many=True)
        return Response(serializer.data)

    def post(self, request, turf_id):
        turf = get_object_or_404(Turfs, id=turf_id)

        # ownership check
        if turf.owner != request.user:
            return Response({"detail": "Not allowed"}, status=403)

        image_file = request.FILES.get("image")
        if not image_file:
            return Response({"detail": "Image file required"}, status=400)

        upload = cloudinary.uploader.upload(image_file)

        image = TurfImage.objects.create(
            turf=turf,
            image_url=upload["secure_url"],
            priority=request.data.get("priority", 0)
        )

        serializer = TurfImageSerializer(image)
        return Response(serializer.data, status=201)


class TurfImageDetailAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, image_id):
        image = get_object_or_404(TurfImage, id=image_id)

        if image.turf.owner != request.user:
            return Response({"detail": "Not allowed"}, status=403)

        image.priority = request.data.get("priority", image.priority)
        image.save()

        return Response(TurfImageSerializer(image).data)

    def delete(self, request, image_id):
        image = get_object_or_404(TurfImage, id=image_id)

        if image.turf.owner != request.user:
            return Response({"detail": "Not allowed"}, status=403)

        image.delete()
        return Response(status=204)
