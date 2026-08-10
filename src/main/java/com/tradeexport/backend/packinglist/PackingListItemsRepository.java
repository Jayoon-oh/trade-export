package com.tradeexport.backend.packinglist;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PackingListItemsRepository extends JpaRepository<PackingListItems, Long> {
    List<PackingListItems> findByPackingListId(Long packingListId);
}
