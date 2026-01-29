from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from app.serializers.booking import BookingSerializer
from app.models.booking import Booking
from app.permission import IsUser

class BookingCreateView(CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsUser]

    def perform_create(self, serializer):
        serializer.save(custumer=self.request.user)


class MyBookingsView(ListAPIView):
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.filter(custumer=self.request.user)


class BookingCancelView(UpdateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    http_method_names = ['patch']

    def perform_update(self, serializer):
        serializer.save(amount=0)
