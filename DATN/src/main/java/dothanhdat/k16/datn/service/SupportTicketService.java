package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.response.SupportTicketResponse;
import dothanhdat.k16.datn.entity.Notification.SupportTicket;

import java.util.List;

public interface SupportTicketService {
    List<SupportTicketResponse> getSupportTicketsByUserId(int userId);
    SupportTicketResponse sendSupportTicket(SupportTicket supportTicket);
    SupportTicketResponse getSupportTicketById(int id);
    String deleteSupportTicket(int id);
    SupportTicketResponse getSupportTicketByOrderId(int orderId);
    List<SupportTicketResponse> getAllSupportTicket();
}
