package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Notification.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Integer> {
    List<SupportTicket> findAllByUserId(int userId);
}
