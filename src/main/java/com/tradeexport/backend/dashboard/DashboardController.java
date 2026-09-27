package com.tradeexport.backend.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderPipelineDto>> getMyOrderPipeline() {
        return ResponseEntity.ok(dashboardService.getMyOrderPipeline());
    }

    @GetMapping("/pipeline-funnel")
    public ResponseEntity<PipelineFunnelDto> getPipelineFunnel() {
        return ResponseEntity.ok(dashboardService.getPipelineFunnel());
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<OrderDetailDto> getOrderDetail(@PathVariable Long orderId){
        return ResponseEntity.ok(dashboardService.getOrderDetail(orderId));
    }
}
