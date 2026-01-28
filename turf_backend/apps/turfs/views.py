from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny , IsAuthenticated
from .models import Turfs
from .serializers import TurfsSerializer

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
            serializer.validated_data['owner_id'] = request.user.id
            serializer.save()
            return Response({"message": "Turf registered successfully", "data": serializer.data},
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