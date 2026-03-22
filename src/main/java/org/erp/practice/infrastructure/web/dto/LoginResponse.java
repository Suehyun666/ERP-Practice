package org.erp.practice.infrastructure.web.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {
    private Long   userId;
    private String username;
    private String displayName;
}
