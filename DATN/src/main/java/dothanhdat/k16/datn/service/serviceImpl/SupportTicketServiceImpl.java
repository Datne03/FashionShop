package dothanhdat.k16.datn.service.serviceImpl;

import dothanhdat.k16.datn.dto.response.SupportTicketResponse;
import dothanhdat.k16.datn.entity.Notification.SupportTicket;
import dothanhdat.k16.datn.entity.Notification.TicketStatus;
import dothanhdat.k16.datn.entity.Order.Order;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.mapper.ISupportTicketMapper;
import dothanhdat.k16.datn.repository.OrderRepository;
import dothanhdat.k16.datn.repository.SupportTicketRepository;
import dothanhdat.k16.datn.repository.UserRepository;
import dothanhdat.k16.datn.service.SupportTicketService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class SupportTicketServiceImpl implements SupportTicketService {
    UserRepository userRepository;
    OrderRepository orderRepository;
    SupportTicketRepository supportTicketRepository;
    ISupportTicketMapper supportTicketMapper;
    NotificationServiceImpl notificationService;

    @Override
    public List<SupportTicketResponse> getSupportTicketsByUserId(int userId) {
        return supportTicketRepository.findAllByUserId(userId)
                .stream()
                .filter(supportTicket -> !supportTicket.isDeleted())
                .map(supportTicketMapper::toSupportTicketResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SupportTicketResponse sendSupportTicket(SupportTicket supportTicket) {
        User user = userRepository.findById(supportTicket.getUser().getId()).orElseThrow(() -> new RuntimeException("User Not Found"));
        Order order = orderRepository.findById(supportTicket.getOrder().getId()).orElseThrow(() -> new RuntimeException("Order Not Found"));

        supportTicket.setUser(user);
        supportTicket.setOrder(order);
        supportTicket.setIssue(supportTicket.getIssue());
        supportTicket.setCreatedAt(LocalDateTime.now());
        supportTicket.setStatus(TicketStatus.PENDING);
        supportTicket = supportTicketRepository.save(supportTicket);
        return supportTicketMapper.toSupportTicketResponse(supportTicket);
    }

    @Override
    public SupportTicketResponse getSupportTicketById(int id) {
        SupportTicket supportTicket = supportTicketRepository.findById(id).orElse(null);
        return supportTicketMapper.toSupportTicketResponse(supportTicket);
    }

    @Override
    public String deleteSupportTicket(int id) {
        SupportTicket supportTicket = supportTicketRepository.findById(id).orElseThrow(() -> new RuntimeException("Support Ticket Not Found"));
        supportTicket.setDeleted(true);
        supportTicketRepository.save(supportTicket);
        return "Delete success";
    }

    @Override
    public SupportTicketResponse getSupportTicketByOrderId(int orderId) {
        SupportTicket supportTicket = supportTicketRepository.findById(orderId).orElse(null);
        return supportTicketMapper.toSupportTicketResponse(supportTicket);
    }

    @Override
    public List<SupportTicketResponse> getAllSupportTicket() {
        return supportTicketRepository.findAll()
                .stream().map(supportTicketMapper::toSupportTicketResponse)
                .collect(Collectors.toList());
    }
}
