from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated
from serializers.business import BusinessSerializer
from permission import IsOwner

class BusinessCreateView(CreateAPIView):
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
